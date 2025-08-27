# NEARWEEK

> Automatisk Figma til GitHub workflow for nearweek.com

## Live Website
**https://nearweek.com**

## ⚡ Automatiseret Workflow

### Sådan fungerer det:
1. **Du:** "Opdater nearweek.com fra Figma"
2. **Claude:** Henter dit Figma Sites design
3. **Claude:** Konverterer til HTML/CSS/JS  
4. **Claude:** Viser dig preview
5. **Du:** "Deploy det!" eller "Lav rettelser"
6. **Claude:** Pusher til GitHub automatisk
7. **GitHub Actions:** Deployer til nearweek.com (~ 2 minutter)

## Repository Struktur
nearweek-website/
├── index.html                    # Hovedside (auto-genereret)
├── styles-main.css              # Stylesheet
├── ⚡ scripts-main.js               # JavaScript functionality
├── github-workflows-deploy.yml  # Auto-deploy workflow
├── sitemap.xml                  # SEO sitemap (auto-genereret)
├── robots.txt                   # Søgemaskine instruktioner (auto-genereret)
├── CNAME                        # Custom domain config (auto-genereret)
└── README.md                    # Denne fil

## DESIGN INTEGRATION

- **Figma Sites URL:** [NEARWEEK NEW WEB](https://www.figma.com/site/njsvoaSX2WwTMXCUDUs55b/NEARWEEK-NEW-WEB)
- **Auto-sync:** Design tokens, farver, typografi, spacing
- **Export:** Automatisk billedeeksport og optimering

## DEPLOYMENT

- **Trigger:** Push til `main` branch
- **Tid:** ~2-3 minutter fra commit til live
- **Status:** Se [Actions tab](https://github.com/b4ltasar/website/actions)

## DNS CONFIGURATION

At domainprovider add the following DNS records:

### A Records:
Type: A | Name: @ | Value: 185.199.108.153
Type: A | Name: @ | Value: 185.199.109.153
Type: A | Name: @ | Value: 185.199.110.153
Type: A | Name: @ | Value: 185.199.111.153

### CNAME Record:
Type: CNAME | Name: www | Value: b4ltasar.github.io

## 🤖 AI Commands

### PRIMARY COMMANDS:
- `"Opdater nearweek.com fra Figma"` - Fuld update med preview
- `"Deploy ændringer til nearweek.com"` - Direct deploy 
- `"Vis preview af ændringer"` - Kun preview mode
- `"Status på nearweek.com"` - Site health check

### DESIGN COMMANDS:
- `"Eksporter billeder fra Figma"` - Asset update
- `"Optimér performance"` - Speed improvements
- `"SEO optimering"` - Search engine optimization

### TROUBLESHOOTING:
- `"Rollback til tidligere version"` - Gendan forrige deploy
- `"Test responsive design"` - Mobile compatibility check

## STATUS

- **Website:** ✅ Live på nearweek.com
- **Auto-deploy:** ✅ Configured  
- **DNS:** ⏳ Needs setup
- **SSL:** ✅ Secure HTTPS
- **Performance:** ✅ Optimized
- **SEO:** ✅ Ready for indexing

---
