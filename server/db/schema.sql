--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    title text,
    preferences text,
    dnc boolean,
    intake_only boolean,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    contact_type text[],
    active boolean DEFAULT true NOT NULL,
    vip boolean DEFAULT false NOT NULL
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_id_seq OWNER TO postgres;

--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    id integer NOT NULL,
    level text NOT NULL,
    acting_user text NOT NULL,
    action text NOT NULL,
    target_id text,
    target_user text,
    origin_ip text,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_id_seq OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;


--
-- Name: pharmacies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacies (
    id integer NOT NULL,
    name text NOT NULL,
    communication text,
    verbal_orders boolean,
    general_notes text,
    oncall_prefs text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.pharmacies OWNER TO postgres;

--
-- Name: pharmacies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacies_id_seq OWNER TO postgres;

--
-- Name: pharmacies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacies_id_seq OWNED BY public.pharmacies.id;


--
-- Name: pharmacy_blurbs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_blurbs (
    blurb_id integer NOT NULL,
    pharmacy_id integer NOT NULL
);


ALTER TABLE public.pharmacy_blurbs OWNER TO postgres;

--
-- Name: pharmacy_blurbs_blurb_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_blurbs_blurb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_blurbs_blurb_id_seq OWNER TO postgres;

--
-- Name: pharmacy_blurbs_blurb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_blurbs_blurb_id_seq OWNED BY public.pharmacy_blurbs.blurb_id;


--
-- Name: pharmacy_blurbs_pharmacy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_blurbs_pharmacy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_blurbs_pharmacy_id_seq OWNER TO postgres;

--
-- Name: pharmacy_blurbs_pharmacy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_blurbs_pharmacy_id_seq OWNED BY public.pharmacy_blurbs.pharmacy_id;


--
-- Name: pharmacy_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_contacts (
    pharmacy_id integer NOT NULL,
    contact_id integer NOT NULL
);


ALTER TABLE public.pharmacy_contacts OWNER TO postgres;

--
-- Name: pharmacy_contacts_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_contacts_contact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_contacts_contact_id_seq OWNER TO postgres;

--
-- Name: pharmacy_contacts_contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_contacts_contact_id_seq OWNED BY public.pharmacy_contacts.contact_id;


--
-- Name: pharmacy_contacts_pharmacy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_contacts_pharmacy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_contacts_pharmacy_id_seq OWNER TO postgres;

--
-- Name: pharmacy_contacts_pharmacy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_contacts_pharmacy_id_seq OWNED BY public.pharmacy_contacts.pharmacy_id;


--
-- Name: pharmacy_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_rules (
    pharmacy_id integer NOT NULL,
    rules_id integer NOT NULL
);


ALTER TABLE public.pharmacy_rules OWNER TO postgres;

--
-- Name: pharmacy_rules_pharmacy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_rules_pharmacy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_rules_pharmacy_id_seq OWNER TO postgres;

--
-- Name: pharmacy_rules_pharmacy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_rules_pharmacy_id_seq OWNED BY public.pharmacy_rules.pharmacy_id;


--
-- Name: pharmacy_rules_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_rules_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_rules_rules_id_seq OWNER TO postgres;

--
-- Name: pharmacy_rules_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_rules_rules_id_seq OWNED BY public.pharmacy_rules.rules_id;


--
-- Name: pharmacy_training; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_training (
    pharmacy_id integer NOT NULL,
    training_id integer NOT NULL
);


ALTER TABLE public.pharmacy_training OWNER TO postgres;

--
-- Name: pharmacy_training_pharmacy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_training_pharmacy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_training_pharmacy_id_seq OWNER TO postgres;

--
-- Name: pharmacy_training_pharmacy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_training_pharmacy_id_seq OWNED BY public.pharmacy_training.pharmacy_id;


--
-- Name: pharmacy_training_training_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_training_training_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_training_training_id_seq OWNER TO postgres;

--
-- Name: pharmacy_training_training_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_training_training_id_seq OWNED BY public.pharmacy_training.training_id;


--
-- Name: rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rules (
    id integer NOT NULL,
    rule text NOT NULL
);


ALTER TABLE public.rules OWNER TO postgres;

--
-- Name: rules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rules_id_seq OWNER TO postgres;

--
-- Name: rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rules_id_seq OWNED BY public.rules.id;


--
-- Name: training; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.training (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.training OWNER TO postgres;

--
-- Name: training_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.training_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_id_seq OWNER TO postgres;

--
-- Name: training_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.training_id_seq OWNED BY public.training.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    role text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vn_blurbs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vn_blurbs (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    type text NOT NULL
);


ALTER TABLE public.vn_blurbs OWNER TO postgres;

--
-- Name: vn_blurbs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vn_blurbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vn_blurbs_id_seq OWNER TO postgres;

--
-- Name: vn_blurbs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vn_blurbs_id_seq OWNED BY public.vn_blurbs.id;


--
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- Name: pharmacies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacies ALTER COLUMN id SET DEFAULT nextval('public.pharmacies_id_seq'::regclass);


--
-- Name: pharmacy_blurbs blurb_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_blurbs ALTER COLUMN blurb_id SET DEFAULT nextval('public.pharmacy_blurbs_blurb_id_seq'::regclass);


--
-- Name: pharmacy_blurbs pharmacy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_blurbs ALTER COLUMN pharmacy_id SET DEFAULT nextval('public.pharmacy_blurbs_pharmacy_id_seq'::regclass);


--
-- Name: pharmacy_contacts pharmacy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_contacts ALTER COLUMN pharmacy_id SET DEFAULT nextval('public.pharmacy_contacts_pharmacy_id_seq'::regclass);


--
-- Name: pharmacy_contacts contact_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_contacts ALTER COLUMN contact_id SET DEFAULT nextval('public.pharmacy_contacts_contact_id_seq'::regclass);


--
-- Name: pharmacy_rules pharmacy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_rules ALTER COLUMN pharmacy_id SET DEFAULT nextval('public.pharmacy_rules_pharmacy_id_seq'::regclass);


--
-- Name: pharmacy_rules rules_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_rules ALTER COLUMN rules_id SET DEFAULT nextval('public.pharmacy_rules_rules_id_seq'::regclass);


--
-- Name: pharmacy_training pharmacy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_training ALTER COLUMN pharmacy_id SET DEFAULT nextval('public.pharmacy_training_pharmacy_id_seq'::regclass);


--
-- Name: pharmacy_training training_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_training ALTER COLUMN training_id SET DEFAULT nextval('public.pharmacy_training_training_id_seq'::regclass);


--
-- Name: rules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rules ALTER COLUMN id SET DEFAULT nextval('public.rules_id_seq'::regclass);


--
-- Name: training id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training ALTER COLUMN id SET DEFAULT nextval('public.training_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vn_blurbs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vn_blurbs ALTER COLUMN id SET DEFAULT nextval('public.vn_blurbs_id_seq'::regclass);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: pharmacies pharmacies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacies
    ADD CONSTRAINT pharmacies_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_blurbs pharmacy_blurbs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_blurbs
    ADD CONSTRAINT pharmacy_blurbs_pkey PRIMARY KEY (blurb_id, pharmacy_id);


--
-- Name: pharmacy_contacts pharmacy_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_contacts
    ADD CONSTRAINT pharmacy_contacts_pkey PRIMARY KEY (pharmacy_id, contact_id);


--
-- Name: pharmacy_rules pharmacy_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_rules
    ADD CONSTRAINT pharmacy_rules_pkey PRIMARY KEY (pharmacy_id, rules_id);


--
-- Name: pharmacy_training pharmacy_training_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_training
    ADD CONSTRAINT pharmacy_training_pkey PRIMARY KEY (pharmacy_id, training_id);


--
-- Name: rules rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_pkey PRIMARY KEY (id);


--
-- Name: training training_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training
    ADD CONSTRAINT training_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vn_blurbs vn_blurbs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vn_blurbs
    ADD CONSTRAINT vn_blurbs_pkey PRIMARY KEY (id);


--
-- Name: unique_lower_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_lower_username ON public.users USING btree (lower(username));


--
-- Name: pharmacy_blurbs fk_blurb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_blurbs
    ADD CONSTRAINT fk_blurb FOREIGN KEY (blurb_id) REFERENCES public.vn_blurbs(id);


--
-- Name: pharmacy_blurbs fk_pharm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_blurbs
    ADD CONSTRAINT fk_pharm FOREIGN KEY (pharmacy_id) REFERENCES public.pharmacies(id);


--
-- Name: pharmacy_contacts pharmacy_contacts_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_contacts
    ADD CONSTRAINT pharmacy_contacts_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id) NOT VALID;


--
-- Name: pharmacy_contacts pharmacy_contacts_pharmacy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_contacts
    ADD CONSTRAINT pharmacy_contacts_pharmacy_id_fkey FOREIGN KEY (pharmacy_id) REFERENCES public.pharmacies(id) NOT VALID;


--
-- Name: pharmacy_rules pharmacy_rules_pharmacy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_rules
    ADD CONSTRAINT pharmacy_rules_pharmacy_id_fkey FOREIGN KEY (pharmacy_id) REFERENCES public.pharmacies(id);


--
-- Name: pharmacy_rules pharmacy_rules_rules_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_rules
    ADD CONSTRAINT pharmacy_rules_rules_id_fkey FOREIGN KEY (rules_id) REFERENCES public.rules(id);


--
-- Name: pharmacy_training pharmacy_training_pharmacy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_training
    ADD CONSTRAINT pharmacy_training_pharmacy_id_fkey FOREIGN KEY (pharmacy_id) REFERENCES public.pharmacies(id);


--
-- Name: pharmacy_training pharmacy_training_training_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_training
    ADD CONSTRAINT pharmacy_training_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.training(id);


--
-- PostgreSQL database dump complete
--

