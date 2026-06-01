// colors.ts - Cores do Routex com suporte a tema escuro/claro

// Cores para tema ESCURO (padrão)
export const colorsDark = {
    // Cores principais
    primary: '#0047AB',     // Azul royal
    secondary: '#00FF88',   // Verde neon
    dark: '#1A1A2E',        // Azul meia-noite (fundo)
    alert: '#FFB800',       // Amarelo alerta
    
    // Cores neutras
    white: '#F0F4F8',       // Branco gelo (texto)
    gray: '#4A4A5E',        // Cinza (texto secundário)
    black: '#0A0A14',       // Preto (cards)
    
    // Cores funcionais
    success: '#00FF88',     // Verde sucesso
    error: '#FF4444',       // Vermelho erro
    info: '#0047AB',        // Azul informação
};

// Cores para tema CLARO
export const colorsLight = {
    // Cores principais
    primary: '#0047AB',     // Azul royal
    secondary: '#00AA55',   // Verde mais escuro
    dark: '#FFFFFF',        // Branco (fundo)
    alert: '#FF8C00',       // Laranja alerta
    
    // Cores neutras
    white: '#1A1A2E',       // Azul escuro (texto)
    gray: '#666666',        // Cinza (texto secundário)
    black: '#F5F5F5',       // Cinza claro (cards)
    
    // Cores funcionais
    success: '#00AA55',     // Verde
    error: '#FF4444',       // Vermelho
    info: '#0047AB',        // Azul
};

// Padrão (escuro) para compatibilidade
export const colors = colorsDark;
export type Colors = typeof colorsDark;