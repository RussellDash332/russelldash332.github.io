# Converts all Markdown files to a HTML blog!
import os, mdtex2html, markdown, datetime as dt, textwrap as tw
from bs4 import BeautifulSoup, NavigableString

TW_WIDTH_LIMIT = 200
md2html = lambda c: [markdown.markdown, mdtex2html.convert][1](c, extensions=[
    'tables', 'pymdownx.arithmatex', 'pymdownx.superfences', 'nl2br', 'smarty', 'pymdownx.smartsymbols',
    'pymdownx.tilde', 'pymdownx.emoji', 'pymdownx.highlight', 'pymdownx.inlinehilite'
])

html_content = open(os.path.join('posts', 'index.html')).read()
template_content = open(os.path.join('posts', '_template.html')).read()
soup = BeautifulSoup(html_content, 'html.parser')
posts_container = soup.find('div', id='posts-container')
posts_container.clear()
posts = []
for path, dirs, files in os.walk('markdown'):
    for file in files:
        if file.endswith('.md'):
            markdown_content = open(os.path.join(path, file)).read()
            md2html_content = md2html(markdown_content)
            md_soup = BeautifulSoup(md2html_content, 'html.parser')

            first_p = md_soup.find('p')
            first_h1 = md_soup.find('h1')

            date = dt.datetime.strptime(first_p.text, '%d %B %Y')
            new_tag = md_soup.new_tag("div")
            new_tag["class"] = "date"
            first_p.wrap(new_tag)

            # style issue
            for h in md_soup.findAll('h4'): h.name = 'h5'
            for h in md_soup.findAll('h3'): h.name = 'h4'
            for h in md_soup.findAll('h2'): h.name = 'h3'
            for h in md_soup.findAll('h1'): h.name = 'h2'

            html_fn = os.path.join('posts', file.strip('.md')+'.html')
            posts.append((date, first_h1.text, first_p.text, html_fn.split('/')[-1], '\n'.join(p.text for p in md_soup.findAll('p')[1:])))

            template_soup = BeautifulSoup(template_content, 'html.parser')
            template_title = template_soup.find('title')
            template_title.insert(0, NavigableString(first_h1.text))
            post_container = template_soup.find('div', {'class': 'post-container'})
            post_container.insert(0, md_soup)

            with open(html_fn, 'w+') as f:
                f.write(str(template_soup))

for date, title, date_text, html_fn, md_soup_p in sorted(posts, reverse=True):
    if html_fn.startswith('_'): continue
    print([date_text, title, html_fn])
    summary = tw.shorten(md_soup_p, width=TW_WIDTH_LIMIT, placeholder='...')
    new_article = soup.new_tag("article")
    new_a = soup.new_tag("a")
    new_a['href'] = html_fn
    new_div = soup.new_tag('div')
    #new_div['class'] = 'inner'
    new_p = soup.new_tag('p')
    new_p2 = soup.new_tag('p')
    new_h4 = soup.new_tag('h4')
    new_h4.insert(0, NavigableString(title))
    new_p.insert(0, NavigableString(date_text))
    new_p2.insert(0, NavigableString(summary))
    new_div.append(new_h4)
    new_div.append(new_p)
    new_div.append(new_p2)
    new_a.append(new_div)
    new_article.append(new_a)
    posts_container.append(new_article)

with open(os.path.join('posts', 'index.html'), 'w+') as f:
    f.write(soup.prettify())
    f.close()