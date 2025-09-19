// Enhanced Markdown Editor with Custom Extensions

// Configure marked.js with custom extensions
if (window.marked) {
    marked.use({
        extensions: [
            // Admonitions/Callouts
            {
                name: 'admonition',
                level: 'block',
                start(src) {
                    return src.match(/^:::/m)?.index;
                },
                tokenizer(src) {
                    const match = src.match(/^:::(info|warning|success|danger|note|tip|important)\n([\s\S]*?)^:::/m);
                    if (match) {
                        return {
                            type: 'admonition',
                            raw: match[0],
                            admonitionType: match[1],
                            text: match[2].trim()
                        };
                    }
                },
                renderer(token) {
                    const lines = token.text.split('\n');
                    const title = lines[0]?.replace(/^\*\*|\*\*$/g, '') || token.admonitionType;
                    const content = lines.slice(1).join('\n');

                    return `
                        <div class="admonition admonition-${token.admonitionType}">
                            <div class="admonition-title">${title}</div>
                            <div class="admonition-content">${marked.parse(content)}</div>
                        </div>
                    `;
                }
            },

            // Tabs
            {
                name: 'tabs',
                level: 'block',
                start(src) {
                    return src.match(/^:::tabs/m)?.index;
                },
                tokenizer(src) {
                    const match = src.match(/^:::tabs\n([\s\S]*?)^:::/m);
                    if (match) {
                        const tabsContent = match[1];
                        const tabs = [];
                        const tabRegex = /::tab\{label="([^"]+)"\}\n([\s\S]*?)(?=::tab|$)/g;
                        let tabMatch;

                        while ((tabMatch = tabRegex.exec(tabsContent)) !== null) {
                            tabs.push({
                                label: tabMatch[1],
                                content: tabMatch[2].trim()
                            });
                        }

                        return {
                            type: 'tabs',
                            raw: match[0],
                            tabs: tabs
                        };
                    }
                },
                renderer(token) {
                    const tabId = 'tab-' + Math.random().toString(36).substr(2, 9);
                    let html = '<div class="tabs-container">';
                    html += '<div class="tab-buttons">';

                    token.tabs.forEach((tab, index) => {
                        html += `<button class="tab-button ${index === 0 ? 'active' : ''}"
                                        onclick="switchTab('${tabId}', ${index})">${tab.label}</button>`;
                    });

                    html += '</div>';

                    token.tabs.forEach((tab, index) => {
                        html += `<div class="tab-content ${index === 0 ? 'active' : ''}"
                                      id="${tabId}-${index}">${marked.parse(tab.content)}</div>`;
                    });

                    html += '</div>';
                    return html;
                }
            },

            // Mermaid diagrams
            {
                name: 'mermaid',
                level: 'block',
                start(src) {
                    return src.match(/^```mermaid/m)?.index;
                },
                tokenizer(src) {
                    const match = src.match(/^```mermaid\n([\s\S]*?)^```/m);
                    if (match) {
                        return {
                            type: 'mermaid',
                            raw: match[0],
                            text: match[1].trim()
                        };
                    }
                },
                renderer(token) {
                    const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
                    return `<div id="${id}" class="mermaid">${token.text}</div>`;
                }
            }
        ],

        // Configure marked options
        breaks: true,
        gfm: true,
        headerIds: true,
        highlight: function(code, lang) {
            if (window.Prism && Prism.languages[lang]) {
                try {
                    return Prism.highlight(code, Prism.languages[lang], lang);
                } catch (e) {
                    console.error('Prism highlight error:', e);
                }
            }
            return code;
        }
    });
}

// Tab switching function
function switchTab(tabId, index) {
    const container = document.querySelector(`[id^="${tabId}"]`).parentElement;
    container.querySelectorAll('.tab-button').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    container.querySelectorAll('.tab-content').forEach((content, i) => {
        content.classList.toggle('active', i === index);
    });
}

// Initialize Mermaid if available
if (typeof mermaid !== 'undefined') {
    mermaid.initialize({ theme: 'default', startOnLoad: true });
}

// Add custom styles for markdown extensions
const customStyles = `
<style>
/* Admonitions */
.admonition {
    margin: 1em 0;
    padding: 1em;
    border-radius: 6px;
    border-left: 4px solid;
}

.admonition-title {
    font-weight: 600;
    margin-bottom: 0.5em;
}

.admonition-info {
    background: rgba(0, 161, 241, 0.1);
    border-left-color: #00A1F1;
}

.admonition-info .admonition-title {
    color: #00A1F1;
}

.admonition-warning {
    background: rgba(254, 95, 0, 0.1);
    border-left-color: #FE5F00;
}

.admonition-warning .admonition-title {
    color: #FE5F00;
}

.admonition-success {
    background: rgba(62, 184, 95, 0.1);
    border-left-color: #3EB85F;
}

.admonition-success .admonition-title {
    color: #3EB85F;
}

.admonition-danger {
    background: rgba(220, 38, 38, 0.1);
    border-left-color: #DC2626;
}

.admonition-danger .admonition-title {
    color: #DC2626;
}

/* Tabs */
.tabs-container {
    margin: 1em 0;
}

.tab-buttons {
    display: flex;
    gap: 0.5em;
    border-bottom: 2px solid #e5e5e5;
    margin-bottom: 1em;
}

.tab-button {
    padding: 0.5em 1em;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-weight: 500;
    margin-bottom: -2px;
}

.tab-button:hover {
    background: #f5f5f5;
}

.tab-button.active {
    color: #00A1F1;
    border-bottom-color: #00A1F1;
}

.tab-content {
    display: none;
    padding: 1em 0;
}

.tab-content.active {
    display: block;
}

/* Mermaid diagrams */
.mermaid {
    text-align: center;
    margin: 1em 0;
}
</style>
`;

// Inject custom styles
document.head.insertAdjacentHTML('beforeend', customStyles);