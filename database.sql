create table atividades (

  id bigint generated always as identity primary key,

  titulo text not null,

  descricao text,

  data_entrega date,

  status text,

  prioridade text,

  materia_id bigint references materias(id)

);
