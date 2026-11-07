#!/bin/bash

# Түстер
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # Түссіз

echo -e "${BLUE}===================================================================${NC}"
echo -e "${BLUE}     🛡️  ҚАУІПСІЗДІК ПЕН ОРТА БАҚЫЛАУ СКРИПТІ (agent_cmd)         ${NC}"
echo -e "${BLUE}===================================================================${NC}"

# 1. .gitignore тексеру
echo -e "\n${CYAN}[1/3] .gitignore файлын тексеру...${NC}"
PATTERNS=(".env" ".venv/" "__pycache__/" "node_modules/" ".next/" "*.log")

if [ ! -f ".gitignore" ]; then
    echo -e "${YELLOW}[!] .gitignore табылмады! Жаңасын жасаймын...${NC}"
    for p in "${PATTERNS[@]}"; do
        echo "$p" >> .gitignore
    done
    echo -e "${GREEN}[✓] .gitignore жасалды.${NC}"
else
    for p in "${PATTERNS[@]}"; do
        if ! grep -q "$p" .gitignore; then
            echo "$p" >> .gitignore
        fi
    done
    echo -e "${GREEN}[✓] .gitignore барлық қорғаныс ережелерін қамтиды.${NC}"
fi

# 2. Құпия кілттер мен парольдердің кетуін тексеру
echo -e "\n${CYAN}[2/3] Құпия кілттер мен парольдер ағып кетуін тексеру...${NC}"
LEAK=0

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    STAGED=$(git diff --cached 2>/dev/null)
    
    if echo "$STAGED" | grep -E "ghp_[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16}|sk-[a-zA-Z0-9]{20,}|BEGIN PRIVATE KEY" >/dev/null 2>&1; then
        echo -e "${RED}╔═════════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║ [!] ЕСКЕРТУ: ИНДЕКСТЕ ҚҰПИЯ КІЛТТЕР ТАБЫЛДЫ! БҰЛАЙ ЖАСАУҒА БОЛМАЙДЫ!║${NC}"
        echo -e "${RED}║ Секреттерді .env файлына жасырып, Git-ке жібермеңіз!                ║${NC}"
        echo -e "${RED}╚═════════════════════════════════════════════════════════════════════╝${NC}"
        LEAK=1
    fi

    if git status --porcelain | grep -E "(^\s*[AM\?].*\.env$|^\.env$)" >/dev/null 2>&1; then
        echo -e "${RED}╔═════════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║ [!] ЕСКЕРТУ: .env файлы Git күйінде тұр! Бұлай жасауға болмайды!    ║${NC}"
        echo -e "${RED}║ .env файлын дереу .gitignore-ға қосып, индекстен алыңыз!            ║${NC}"
        echo -e "${RED}╚═════════════════════════════════════════════════════════════════════╝${NC}"
        LEAK=1
    fi
fi

if [ $LEAK -eq 0 ]; then
    echo -e "${GREEN}[✓] Қауіпсіздік расталды: парольдер мен кілттердің ағуы анықталған жоқ.${NC}"
fi

# 3. Бекітілген стек мәліметі
echo -e "\n${CYAN}[3/3] Жобаның бекітілген технологиялық стек құрылымы:${NC}"
echo -e "  • ${YELLOW}Backend:${NC} FastAPI (backend/), SQLAlchemy 2, Alembic, pytest"
echo -e "  • ${YELLOW}Database:${NC} PostgreSQL"
echo -e "  • ${YELLOW}IAM / Auth:${NC} Keycloak (OIDC, рөлдер: student / teacher / admin)"
echo -e "  • ${YELLOW}Жергілікті AI:${NC} Ollama (app/llm/)"
echo -e "  • ${YELLOW}Frontend:${NC} Next.js 16 (web/)"
echo -e "  • ${YELLOW}Инфрақұрылым:${NC} Nginx, Docker Compose"
echo -e "  • ${YELLOW}Кеңейтілген:${NC} Redis (кэш), RabbitMQ + worker (асинхронды өңдеу)"
echo -e "${BLUE}===================================================================${NC}"
echo -e "${GREEN}Ереже: Агент ұсынады — Сіз шешім қабылдайсыз!${NC}\n"
