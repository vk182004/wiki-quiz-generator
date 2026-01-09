import requests
from bs4 import BeautifulSoup

# Scrapes key content from a Wikipedia article
def scrape_wikipedia(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) WikiQuizApp/1.0"
    }

    # Fetch the page content
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    # Get the main article title
    title_element = soup.find("h1", id="firstHeading") or soup.find("h1")
    title = title_element.text.strip() if title_element else "Unknown Title"

    # Find the main content section of the page
    content_div = soup.find("div", {"id": "mw-content-text"})
    
    # Extract only paragraph text from the main content
    paragraphs = []
    if content_div:
        paragraphs = content_div.find_all("p")
    else:
        # Fallback if main content is not found
        paragraphs = soup.find_all("p")
    
    # Keep only non-empty paragraphs
    meaningful_paragraphs = [p.text.strip() for p in paragraphs if p.text.strip()]
    
    # Combine the first few paragraphs for LLM input
    content = " ".join(meaningful_paragraphs[:8])
    
    # Build a short summary from the first meaningful paragraph
    summary = ""
    for paragraph in meaningful_paragraphs[:5]:
        if len(paragraph) > 50:
            summary = paragraph[:300] + "..." if len(paragraph) > 300 else paragraph
            break
    
    # Fallback summary if nothing suitable was found
    if not summary and meaningful_paragraphs:
        summary = meaningful_paragraphs[0][:200]
    
    # Extract section headings from the page
    sections = []
    
    # Method 1: Standard Wikipedia section headings
    section_elements = soup.select("h2 .mw-headline")
    for element in section_elements:
        section_text = element.text.strip()
        if section_text and section_text.lower() not in ['contents', 'see also', 'references', 'external links', 'notes']:
            sections.append(section_text)
    
    # Method 2: Try plain h2 tags if nothing was found
    if not sections:
        for h2 in soup.find_all("h2"):
            text = h2.text.strip()
            if text and text.lower() not in ['contents', 'see also', 'references', 'external links', 'notes']:
                text = text.replace("[edit]", "").strip()
                if text:
                    sections.append(text)
    
    # Method 3: Use generic section names as a last resort
    if not sections:
        sections = ["Introduction", "Main Content", "History", "Legacy"]
    
    # Simple log to confirm scraping worked
    print(f"✅ Scraped: Title='{title}', Summary length={len(summary)}, Sections={len(sections)}")
    
    return {
        "title": title,
        "content": content,
        "summary": summary if summary else "No summary available",
        "sections": sections[:15],  # Limit to 15 sections
    }
