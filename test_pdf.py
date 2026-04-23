import pdfplumber

def main():
    with pdfplumber.open("res/dictionary.pdf") as pdf:
        print(f"Total pages: {len(pdf.pages)}")
        
if __name__ == "__main__":
    main()
