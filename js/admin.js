// Admin Panel JavaScript

function adminPanel() {
    return {
        // Authentication
        isAuthenticated: false,
        password: '',
        loginError: '',
        token: localStorage.getItem('admin_token'),

        // Editor state
        currentFile: null,
        content: '',
        preview: '',
        isDirty: false,
        lastSaved: null,
        loading: false,

        // Files
        files: [],
        drafts: [],

        // Stats
        wordCount: 0,
        charCount: 0,

        // Initialize
        init() {
            // Check existing token
            if (this.token) {
                this.validateToken();
            }

            // Auto-save drafts
            setInterval(() => {
                if (this.isDirty) {
                    this.saveDraft();
                }
            }, 30000); // Every 30 seconds
        },

        // Authentication methods
        async login() {
            this.loading = true;
            this.loginError = '';

            try {
                const response = await fetch('/api/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password: this.password })
                });

                const data = await response.json();

                if (response.ok) {
                    this.token = data.token;
                    localStorage.setItem('admin_token', this.token);
                    this.isAuthenticated = true;
                    this.loadFiles();
                } else {
                    this.loginError = data.error || 'Invalid password';
                }
            } catch (error) {
                this.loginError = 'Connection error. Please try again.';
            }

            this.loading = false;
        },

        async validateToken() {
            try {
                const response = await fetch('/api/auth/validate', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.ok) {
                    this.isAuthenticated = true;
                    this.loadFiles();
                } else {
                    this.logout();
                }
            } catch (error) {
                this.logout();
            }
        },

        logout() {
            this.isAuthenticated = false;
            this.token = null;
            localStorage.removeItem('admin_token');
            this.password = '';
            this.currentFile = null;
            this.content = '';
        },

        // File operations
        async loadFiles() {
            try {
                const response = await fetch('/api/content', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.files = data.files || [];
                    this.loadDraftsFromStorage();
                }
            } catch (error) {
                console.error('Error loading files:', error);
            }
        },

        async loadFile(file) {
            try {
                const response = await fetch(`/api/content/${file.path}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.currentFile = file;
                    this.content = data.content;
                    this.isDirty = false;
                    this.updatePreview();
                }
            } catch (error) {
                console.error('Error loading file:', error);
            }
        },

        // Draft management
        saveDraft() {
            if (!this.currentFile || !this.content) return;

            const draft = {
                id: this.currentFile.path || 'new-' + Date.now(),
                name: this.currentFile.name || 'Untitled',
                path: this.currentFile.path,
                content: this.content,
                savedAt: new Date().toISOString()
            };

            // Save to localStorage
            const drafts = JSON.parse(localStorage.getItem('editor_drafts') || '[]');
            const index = drafts.findIndex(d => d.id === draft.id);

            if (index >= 0) {
                drafts[index] = draft;
            } else {
                drafts.push(draft);
            }

            localStorage.setItem('editor_drafts', JSON.stringify(drafts));
            this.lastSaved = new Date().toLocaleTimeString();
            this.isDirty = false;
            this.loadDraftsFromStorage();
        },

        loadDraftsFromStorage() {
            const drafts = JSON.parse(localStorage.getItem('editor_drafts') || '[]');
            this.drafts = drafts;
        },

        loadDraft(draft) {
            this.currentFile = {
                name: draft.name,
                path: draft.path
            };
            this.content = draft.content;
            this.isDirty = false;
            this.updatePreview();
        },

        // Publishing
        async publishToGithub() {
            if (!this.currentFile || !this.content) {
                alert('No file to publish');
                return;
            }

            this.loading = true;

            try {
                const response = await fetch('/api/content', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        path: this.currentFile.path || `content/pages/${this.currentFile.name}`,
                        content: this.content,
                        message: `Update ${this.currentFile.name} via admin panel`
                    })
                });

                if (response.ok) {
                    alert('Successfully published to GitHub!');
                    this.isDirty = false;
                    this.loadFiles();

                    // Remove draft after publishing
                    const drafts = JSON.parse(localStorage.getItem('editor_drafts') || '[]');
                    const filtered = drafts.filter(d => d.id !== (this.currentFile.path || 'new-' + Date.now()));
                    localStorage.setItem('editor_drafts', JSON.stringify(filtered));
                    this.loadDraftsFromStorage();
                } else {
                    const error = await response.json();
                    alert('Error publishing: ' + (error.message || 'Unknown error'));
                }
            } catch (error) {
                alert('Connection error: ' + error.message);
            }

            this.loading = false;
        },

        // Create new page
        createNewPage() {
            const name = prompt('Enter page name (e.g., getting-started):');
            if (name) {
                this.currentFile = {
                    name: name + '.md',
                    path: null
                };
                this.content = `# ${name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')}\n\n## Introduction\n\nStart writing your documentation here...\n`;
                this.isDirty = true;
                this.updatePreview();
            }
        },

        // Editor helpers
        updatePreview() {
            if (window.marked) {
                this.preview = window.marked.parse(this.content || '');
            }
            this.updateStats();
            this.isDirty = true;
        },

        updateStats() {
            this.wordCount = this.content.split(/\\s+/).filter(w => w.length > 0).length;
            this.charCount = this.content.length;
        },

        insertMarkdown(before, after) {
            const textarea = document.querySelector('.markdown-editor');
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selected = this.content.substring(start, end);

            const replacement = before + selected + after;
            this.content = this.content.substring(0, start) + replacement + this.content.substring(end);

            this.$nextTick(() => {
                textarea.focus();
                const newPos = start + before.length;
                textarea.setSelectionRange(newPos, newPos + selected.length);
                this.updatePreview();
            });
        },

        insertAdmonition(type) {
            const title = prompt(`Enter ${type} title:`) || type.charAt(0).toUpperCase() + type.slice(1);
            const content = `\n:::{type}\n**${title}**\n\nYour content here...\n:::\n`;
            this.insertMarkdown(content.replace('{type}', type), '');
        },

        insertTabs() {
            const content = `\n:::tabs\n::tab{label="Tab 1"}\nContent for tab 1\n::\n::tab{label="Tab 2"}\nContent for tab 2\n::\n:::\n`;
            this.insertMarkdown(content, '');
        },

        insertCodeBlock() {
            const lang = prompt('Enter language (e.g., javascript, python):') || '';
            const content = `\n\\\`\\\`\\\`${lang}\n// Your code here\n\\\`\\\`\\\`\n`;
            this.insertMarkdown(content, '');
        },

        insertTable() {
            const content = `\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n`;
            this.insertMarkdown(content, '');
        },

        refreshPreview() {
            this.updatePreview();
        }
    };
}