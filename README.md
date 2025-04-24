# Queijos Burger - Menu Digital

Uma aplicação de menu digital para o restaurante Queijos Burger que permite gerenciar produtos, receber pedidos, enviar notificações via WhatsApp e integrar com impressoras térmicas.

## Funcionalidades

- Cadastro de produtos e combos com nome, foto, descrição e preço
- Menu digital para clientes fazerem pedidos online
- Envio de pedidos para WhatsApp Business
- Painel administrativo para gerenciar produtos e pedidos
- Opções de delivery e retirada no balcão

## Tecnologias Utilizadas

- React.js 
- Tailwind CSS
- Vite
- Vercel API Routes
- CockroachDB
- Drizzle ORM
- WhatsApp Integration

## Configuração

Para executar este projeto localmente:

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Configure as variáveis de ambiente no arquivo `.env`
4. Execute `npm run dev` para iniciar o servidor de desenvolvimento

## Estrutura do Projeto

```
├── api/                    # API Routes para Vercel
├── drizzle/                # Schemas e migrações do banco de dados
├── public/                 # Arquivos estáticos
└── src/                    # Código fonte
    ├── components/         # Componentes React
    ├── context/            # Contextos React (como o carrinho)
    ├── layouts/            # Layouts da aplicação
    └── pages/              # Páginas da aplicação
```

## Sistema de Carrinho

A aplicação inclui um sistema de carrinho completo que permite:

- Adicionar produtos ao carrinho
- Remover produtos do carrinho
- Ajustar quantidades
- Calcular o total automaticamente
- Salvar o carrinho no localStorage para persistência

## Painel Administrativo 

O painel administrativo permite:

- Gerenciar produtos (criar, editar, remover)
- Visualizar pedidos
- Atualizar status de pedidos
- Notificar clientes via WhatsApp

## Segurança

O acesso ao painel administrativo é protegido por senha.