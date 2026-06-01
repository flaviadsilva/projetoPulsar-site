-- =========================================
-- BANCO DE DADOS - PROGRAMA PULSAR
-- =========================================

CREATE DATABASE programa_pulsar;

USE programa_pulsar;

-- =========================================
-- TABELA USUARIOS
-- =========================================

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('admin', 'colaborador') DEFAULT 'colaborador',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABELA EMPRESAS
-- =========================================

CREATE TABLE empresas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_empresa VARCHAR(150) NOT NULL,
    responsavel VARCHAR(100),
    telefone VARCHAR(20),
    email VARCHAR(150),
    segmento ENUM(
        'Prefeitura',
        'Hospital',
        'Escola',
        'Empresa Privada',
        'Instituição Social'
    ),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABELA CONTATOS
-- =========================================

CREATE TABLE contatos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    assunto VARCHAR(150),
    mensagem TEXT NOT NULL,
    enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABELA PROGRAMAS
-- =========================================

CREATE TABLE programas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    duracao VARCHAR(50),
    publico_alvo VARCHAR(100),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABELA AGENDAMENTOS
-- =========================================

CREATE TABLE agendamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT,
    data_agendamento DATE NOT NULL,
    horario TIME NOT NULL,
    tipo_evento ENUM(
        'Palestra',
        'Treinamento',
        'Vivência',
        'Consultoria'
    ) NOT NULL,
    observacoes TEXT,
    status ENUM(
        'Pendente',
        'Confirmado',
        'Finalizado',
        'Cancelado'
    ) DEFAULT 'Pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (empresa_id)
    REFERENCES empresas(id)
    ON DELETE CASCADE
);

-- =========================================
-- TABELA DIAGNOSTICOS
-- =========================================

CREATE TABLE diagnosticos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT,

    nivel_estresse INT CHECK (nivel_estresse BETWEEN 1 AND 10),
    nivel_comunicacao INT CHECK (nivel_comunicacao BETWEEN 1 AND 10),
    nivel_engajamento INT CHECK (nivel_engajamento BETWEEN 1 AND 10),

    observacoes TEXT,

    data_resposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (empresa_id)
    REFERENCES empresas(id)
    ON DELETE CASCADE
);

-- =========================================
-- TABELA DEPOIMENTOS
-- =========================================

CREATE TABLE depoimentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    empresa VARCHAR(150),
    depoimento TEXT NOT NULL,
    imagem VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- INSERINDO DADOS DE TESTE
-- =========================================

INSERT INTO usuarios (nome, email, senha, tipo_usuario)
VALUES
('Administrador', 'admin@pulsar.com', '123456', 'admin');

INSERT INTO empresas (
    nome_empresa,
    responsavel,
    telefone,
    email,
    segmento,
    cidade,
    estado
)
VALUES
(
    'Hospital Centenário',
    'Juliana Freitas',
    '(51) 99999-9999',
    'hospital@teste.com',
    'Hospital',
    'São Leopoldo',
    'RS'
),
(
    'Escola Esperança',
    'Carlos Silva',
    '(51) 98888-8888',
    'escola@teste.com',
    'Escola',
    'Novo Hamburgo',
    'RS'
);

INSERT INTO programas (
    titulo,
    descricao,
    duracao,
    publico_alvo
)
VALUES
(
    'Saúde Emocional nas Empresas',
    'Treinamento voltado para equilíbrio emocional.',
    '2 horas',
    'Empresas'
),
(
    'Comunicação Humanizada',
    'Programa para melhorar relações interpessoais.',
    '4 horas',
    'Hospitais'
);

INSERT INTO agendamentos (
    empresa_id,
    data_agendamento,
    horario,
    tipo_evento,
    observacoes,
    status
)
VALUES
(
    1,
    '2026-06-10',
    '14:00:00',
    'Palestra',
    'Evento sobre saúde emocional',
    'Confirmado'
),
(
    2,
    '2026-06-15',
    '09:00:00',
    'Treinamento',
    'Treinamento para professores',
    'Pendente'
);

INSERT INTO diagnosticos (
    empresa_id,
    nivel_estresse,
    nivel_comunicacao,
    nivel_engajamento,
    observacoes
)
VALUES
(
    1,
    8,
    5,
    6,
    'Equipe apresenta sinais de sobrecarga.'
),
(
    2,
    4,
    8,
    9,
    'Ambiente saudável e colaborativo.'
);

INSERT INTO depoimentos (
    nome,
    empresa,
    depoimento,
    imagem
)
VALUES
(
    'Mariana Costa',
    'Hospital Centenário',
    'O Programa Pulsar trouxe melhorias incríveis para nossa equipe.',
    'mariana.jpg'
);

INSERT INTO contatos (
    nome,
    email,
    telefone,
    assunto,
    mensagem
)
VALUES
(
    'João Pedro',
    'joao@email.com',
    '(51) 97777-7777',
    'Solicitação de palestra',
    'Gostaria de agendar uma palestra para minha empresa.'
);

-- =========================================
-- CONSULTAS SQL
-- =========================================

-- LISTAR EMPRESAS

SELECT * FROM empresas;

-- LISTAR AGENDAMENTOS CONFIRMADOS

SELECT
    empresas.nome_empresa,
    agendamentos.data_agendamento,
    agendamentos.horario,
    agendamentos.tipo_evento
FROM agendamentos
INNER JOIN empresas
ON empresas.id = agendamentos.empresa_id
WHERE agendamentos.status = 'Confirmado';

-- LISTAR DIAGNOSTICOS

SELECT
    empresas.nome_empresa,
    diagnosticos.nivel_estresse,
    diagnosticos.nivel_comunicacao,
    diagnosticos.nivel_engajamento
FROM diagnosticos
INNER JOIN empresas
ON empresas.id = diagnosticos.empresa_id;

-- =========================================
-- FIM DO BANCO DE DADOS
-- =========================================