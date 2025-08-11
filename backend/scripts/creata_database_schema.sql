CREATE TABLE Personas (
    id_persona VARCHAR(36) PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50),
    correo VARCHAR(100)
);

-- Creación de la tabla Pacientes
-- La llave foránea id_persona es VARCHAR(36) para coincidir.
CREATE TABLE Pacientes (
    id_paciente VARCHAR(36) PRIMARY KEY,
    id_persona VARCHAR(36) UNIQUE,
    CONSTRAINT fk_paciente_persona FOREIGN KEY (id_persona) REFERENCES Personas(id_persona) ON DELETE CASCADE
);

-- Creación de la tabla Especialidades
CREATE TABLE Especialidades (
    id_especialidad VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

-- Creación de la tabla Medicos
-- Ambas llaves foráneas id_persona e id_especialidad son VARCHAR(36).
CREATE TABLE Medicos (
    id_medico VARCHAR(36) PRIMARY KEY,
    id_persona VARCHAR(36) UNIQUE,
    id_especialidad VARCHAR(36) NOT NULL,
    CONSTRAINT fk_medico_persona FOREIGN KEY (id_persona) REFERENCES Personas(id_persona) ON DELETE CASCADE,
    CONSTRAINT fk_medico_especialidad FOREIGN KEY (id_especialidad) REFERENCES Especialidades(id_especialidad) ON DELETE CASCADE
);

-- Creación de la tabla MotivoCita
CREATE TABLE MotivoCitas (
    id_motivo VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Creación de la tabla Estatus
CREATE TABLE Estatus (
    id_estatus VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Creación de la tabla MetodosPago
CREATE TABLE MetodosPago (
    id_metodo_pago VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Creación de la tabla Citas
-- Todas las llaves foráneas de Citas son de tipo VARCHAR(36).
CREATE TABLE Citas (
    id_cita VARCHAR(36) PRIMARY KEY,
    id_paciente VARCHAR(36) NOT NULL,
    id_medico VARCHAR(36) NOT NULL,
    id_motivo VARCHAR(36) NOT NULL,
    id_metodo_pago VARCHAR(36) NOT NULL,
    id_estatus VARCHAR(36) NOT NULL,
    CONSTRAINT fk_cita_paciente FOREIGN KEY (id_paciente) REFERENCES Pacientes(id_paciente),
    CONSTRAINT fk_cita_medico FOREIGN KEY (id_medico) REFERENCES Medicos(id_medico),
    CONSTRAINT fk_cita_motivo FOREIGN KEY (id_motivo) REFERENCES MotivoCitas(id_motivo),
    CONSTRAINT fk_cita_metodo_pago FOREIGN KEY (id_metodo_pago) REFERENCES MetodosPago(id_metodo_pago),
    CONSTRAINT fk_cita_estatus FOREIGN KEY (id_estatus) REFERENCES Estatus(id_estatus)
);