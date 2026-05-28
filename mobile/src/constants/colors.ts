// colors.ts - Paleta oficial do Routex

export const colors = {
  // Cores principais
  primary: '#0047AB',     // Azul royal - botões, cabeçalhos
  secondary: '#00FF88',   // Verde neon - destaques, ícones ativos
  dark: '#1A1A2E',        // Azul meia-noite - fundos
  alert: '#FFB800',       // Amarelo - avisos, cuidados
  
  // Cores neutras
  white: '#F0F4F8',       // Branco gelo - textos
  gray: '#4A4A5E',        // Cinza - textos secundários
  black: '#0A0A14',       // Preto - fundos mais escuros
  
  // Cores funcionais
  success: '#00FF88',     // Verde - sucesso
  error: '#FF4444',       // Vermelho - erro
  
} as const;

export type Colors = typeof colors;