import pdfplumber
import json
import re

def main():
    dictionary = {}
    current_key = []
    current_value = []
    state = "SEEK_KEY" # SEEK_KEY, IN_KEY, IN_VALUE
    
    with pdfplumber.open("res/dictionary.pdf") as pdf:
        for i in range(80, len(pdf.pages)):
            page = pdf.pages[i]
            words = page.extract_words(extra_attrs=['fontname', 'size'])
            
            # Check for end of dictionary
            page_text = page.extract_text()
            if page_text and "ENGLISH-ENOCHIAN" in page_text.upper():
                break
                
            for word in words:
                text = word['text']
                font = word.get('fontname', '')
                x0 = word['x0']
                
                # Skip standalone numbers (page numbers)
                if text.isdigit() and len(text) <= 3:
                    continue
                    
                is_bold = 'Bold' in font
                
                if state == "SEEK_KEY":
                    if is_bold and x0 < 100:
                        current_key = [text]
                        state = "IN_KEY"
                elif state == "IN_KEY":
                    if is_bold: # Still part of the key
                        current_key.append(text)
                    else:
                        state = "IN_VALUE"
                        current_value = [text]
                elif state == "IN_VALUE":
                    if is_bold and x0 < 100:
                        # Save the previous entry
                        key_str = " ".join(current_key).lower().strip()
                        key_str = re.sub(r'[^a-z0-9]$', '', key_str)
                        val_str = " ".join(current_value).strip()
                        
                        if key_str:
                            if key_str in dictionary:
                                dictionary[key_str] += " / " + val_str
                            else:
                                dictionary[key_str] = val_str
                                
                        # Start new entry
                        current_key = [text]
                        current_value = []
                        state = "IN_KEY"
                    else:
                        current_value.append(text)

        # Save last entry
        if current_key and current_value:
            key_str = " ".join(current_key).lower().strip()
            key_str = re.sub(r'[^a-z0-9]$', '', key_str)
            val_str = " ".join(current_value).strip()
            if key_str:
                if key_str in dictionary:
                    dictionary[key_str] += " / " + val_str
                else:
                    dictionary[key_str] = val_str

    # Clean dictionary
    final_dict = {}
    for k, v in dictionary.items():
        if len(k) > 1 or k.isalpha(): # Allow single letters, but ignore junk
            v = re.sub(r'\s+', ' ', v).strip()
            # Replace special characters from PDF artifacts
            v = v.replace('', '')
            final_dict[k] = v

    print(f"Extracted {len(final_dict)} entries.")
    
    # Let's preserve the original res/dictionary.json words if we want,
    # but the prompt says to "convertirlo in res/dictionary.json".
    with open("res/dictionary.json", "w", encoding="utf-8") as f:
        json.dump(final_dict, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()
