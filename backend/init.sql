CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE public.users (
    id integer DEFAULT nextval('users_id_seq') NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    vek integer NOT NULL,
    vyska integer NOT NULL,
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_pkey PRIMARY KEY (id)
) WITH (oids = false);


CREATE TABLE public.metody (
    user_id integer NOT NULL,
    nazov text NOT NULL,
    popis text NOT NULL,
) WITH (oids = false);

CREATE SEQUENCE reklama_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE public.reklama (
    id integer DEFAULT nextval('reklama_id_seq') NOT NULL,
    obrazok text NOT NULL,
    link text NOT NULL,
    pocet integer NOT NULL,
    CONSTRAINT reklama_pkey PRIMARY KEY (id)
) WITH (oids = false);


INSERT INTO reklama (id, obrazok, link, pocet) VALUES
(3,	'https://www.zoc-max.sk/uploads/images/1/node_a791820a328d43af38d6de49444fa1b6.jpg',	'https://www.dracik.sk/',	0),
(2,	'https://www.section.io/engineering-education/history-of-nodejs/nodejs-use-cases-cover-image.png',	'https://nodejs.org/en/',	0),
(1,	'https://www.fiit.stuba.sk/buxus/images/nova_budova/FIIT-budova-jesen20_web.jpg',	'https://www.fiit.stuba.sk/',	0);


CREATE TABLE public.vaha (
    user_id integer NOT NULL,
    datum date NOT NULL,
    hodnota integer NOT NULL,
    typ text NOT NULL,
    metoda text
) WITH (oids = false);

DROP TABLE IF EXISTS kroky;
CREATE TABLE public.kroky (
    user_id integer NOT NULL,
    datum date NOT NULL,
    hodnota integer NOT NULL,
    metoda text
) WITH (oids = false);


DROP TABLE IF EXISTS tep;
CREATE TABLE public.tep (
    user_id integer NOT NULL,
    datum date NOT NULL,
    hodnota integer NOT NULL,
    metoda text
) WITH (oids = false);