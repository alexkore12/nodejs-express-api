#!/bin/bash
# nodejs-express-api Setup Script
# Instala dependencias y configura el entorno Node.js

set -euo pipefail

echo "📦 nodejs-express-api - Configuración"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_node() {
    if command -v node &> /dev/null; then
        echo -e "${GREEN}✓ Node.js encontrado: $(node --version)${NC}"
    else
        echo -e "${RED}✗ Node.js no encontrado${NC}"
        exit 1
    fi
}

check_npm() {
    if command -v npm &> /dev/null; then
        echo -e "${GREEN}✓ npm encontrado: $(npm --version)${NC}"
    else
        echo -e "${RED}✗ npm no encontrado${NC}"
        exit 1
    fi
}

check_nvm() {
    if [ -f "$HOME/.nvm/nvm.sh" ]; then
        echo -e "${GREEN}✓ NVM encontrado${NC}"
    else
        echo -e "${YELLOW}⚠ NVM no encontrado (opcional)${NC}"
    fi
}

install_deps() {
    if [ -f package.json ]; then
        echo -e "${YELLOW}⚠ Instalando dependencias...${NC}"
        npm install
        echo -e "${GREEN}✓ Dependencias instaladas${NC}"
    else
        echo -e "${RED}✗ No se encontró package.json${NC}"
        exit 1
    fi
}

setup_env() {
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            echo -e "${GREEN}✓ Archivo .env creado${NC}"
            echo -e "${YELLOW}⚠ Configura las variables en .env${NC}"
        fi
    else
        echo -e "${GREEN}✓ Archivo .env ya existe${NC}"
    fi
}

main() {
    echo "Iniciando configuración..."
    check_node
    check_npm
    check_nvm
    install_deps
    setup_env
    
    echo ""
    echo "======================================"
    echo -e "${GREEN}✓ Configuración completada!${NC}"
    echo "======================================"
    echo ""
    echo "Para iniciar el API:"
    echo "  npm start"
    echo ""
    echo "Para desarrollo:"
    echo "  npm run dev"
    echo ""
    echo "Tests:"
    echo "  npm test"
}

main "$@"
