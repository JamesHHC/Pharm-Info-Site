--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-16 09:58:45

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
-- TOC entry 217 (class 1259 OID 16389)
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
-- TOC entry 218 (class 1259 OID 16397)
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
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 218
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- TOC entry 219 (class 1259 OID 16398)
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
-- TOC entry 220 (class 1259 OID 16405)
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
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 220
-- Name: pharmacies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacies_id_seq OWNED BY public.pharmacies.id;


--
-- TOC entry 221 (class 1259 OID 16406)
-- Name: pharmacy_blurbs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_blurbs (
    blurb_id integer NOT NULL,
    pharmacy_id integer NOT NULL
);


ALTER TABLE public.pharmacy_blurbs OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16409)
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
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 222
-- Name: pharmacy_blurbs_blurb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_blurbs_blurb_id_seq OWNED BY public.pharmacy_blurbs.blurb_id;


--
-- TOC entry 223 (class 1259 OID 16410)
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
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 223
-- Name: pharmacy_blurbs_pharmacy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_blurbs_pharmacy_id_seq OWNED BY public.pharmacy_blurbs.pharmacy_id;


--
-- TOC entry 224 (class 1259 OID 16411)
-- Name: pharmacy_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_contacts (
    pharmacy_id integer NOT NULL,
    contact_id integer NOT NULL
);


ALTER TABLE public.pharmacy_contacts OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16414)
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
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 225
-- Name: pharmacy_contacts_contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_contacts_contact_id_seq OWNED BY public.pharmacy_contacts.contact_id;


--
-- TOC entry 226 (class 1259 OID 16415)
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
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 226
-- Name: pharmacy_contacts_pharmacy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_contacts_pharmacy_id_seq OWNED BY public.pharmacy_contacts.pharmacy_id;


--
-- TOC entry 227 (class 1259 OID 16416)
-- Name: pharmacy_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_rules (
    pharmacy_id integer NOT NULL,
    rules_id integer NOT NULL
);


ALTER TABLE public.pharmacy_rules OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16419)
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
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 228
-- Name: pharmacy_rules_pharmacy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_rules_pharmacy_id_seq OWNED BY public.pharmacy_rules.pharmacy_id;


--
-- TOC entry 229 (class 1259 OID 16420)
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
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 229
-- Name: pharmacy_rules_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_rules_rules_id_seq OWNED BY public.pharmacy_rules.rules_id;


--
-- TOC entry 230 (class 1259 OID 16421)
-- Name: pharmacy_training; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_training (
    pharmacy_id integer NOT NULL,
    training_id integer NOT NULL
);


ALTER TABLE public.pharmacy_training OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16424)
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
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 231
-- Name: pharmacy_training_pharmacy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_training_pharmacy_id_seq OWNED BY public.pharmacy_training.pharmacy_id;


--
-- TOC entry 232 (class 1259 OID 16425)
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
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 232
-- Name: pharmacy_training_training_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_training_training_id_seq OWNED BY public.pharmacy_training.training_id;


--
-- TOC entry 233 (class 1259 OID 16426)
-- Name: rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rules (
    id integer NOT NULL,
    rule text NOT NULL
);


ALTER TABLE public.rules OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16431)
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
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 234
-- Name: rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rules_id_seq OWNED BY public.rules.id;


--
-- TOC entry 235 (class 1259 OID 16432)
-- Name: training; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.training (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.training OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16437)
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
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 236
-- Name: training_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.training_id_seq OWNED BY public.training.id;


--
-- TOC entry 237 (class 1259 OID 16438)
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
-- TOC entry 238 (class 1259 OID 16444)
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
-- TOC entry 4901 (class 0 OID 0)
-- Dependencies: 238
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 239 (class 1259 OID 16445)
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
-- TOC entry 240 (class 1259 OID 16450)
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
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 240
-- Name: vn_blurbs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vn_blurbs_id_seq OWNED BY public.vn_blurbs.id;


--
-- TOC entry 4690 (class 2604 OID 16451)
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- TOC entry 4694 (class 2604 OID 16452)
-- Name: pharmacies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacies ALTER COLUMN id SET DEFAULT nextval('public.pharmacies_id_seq'::regclass);


--
-- TOC entry 4697 (class 2604 OID 16453)
-- Name: pharmacy_blurbs blurb_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_blurbs ALTER COLUMN blurb_id SET DEFAULT nextval('public.pharmacy_blurbs_blurb_id_seq'::regclass);


--
-- TOC entry 4698 (class 2604 OID 16454)
-- Name: pharmacy_blurbs pharmacy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_blurbs ALTER COLUMN pharmacy_id SET DEFAULT nextval('public.pharmacy_blurbs_pharmacy_id_seq'::regclass);


--
-- TOC entry 4699 (class 2604 OID 16455)
-- Name: pharmacy_contacts pharmacy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_contacts ALTER COLUMN pharmacy_id SET DEFAULT nextval('public.pharmacy_contacts_pharmacy_id_seq'::regclass);


--
-- TOC entry 4700 (class 2604 OID 16456)
-- Name: pharmacy_contacts contact_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_contacts ALTER COLUMN contact_id SET DEFAULT nextval('public.pharmacy_contacts_contact_id_seq'::regclass);


--
-- TOC entry 4701 (class 2604 OID 16457)
-- Name: pharmacy_rules pharmacy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_rules ALTER COLUMN pharmacy_id SET DEFAULT nextval('public.pharmacy_rules_pharmacy_id_seq'::regclass);


--
-- TOC entry 4702 (class 2604 OID 16458)
-- Name: pharmacy_rules rules_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_rules ALTER COLUMN rules_id SET DEFAULT nextval('public.pharmacy_rules_rules_id_seq'::regclass);


--
-- TOC entry 4703 (class 2604 OID 16459)
-- Name: pharmacy_training pharmacy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_training ALTER COLUMN pharmacy_id SET DEFAULT nextval('public.pharmacy_training_pharmacy_id_seq'::regclass);


--
-- TOC entry 4704 (class 2604 OID 16460)
-- Name: pharmacy_training training_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_training ALTER COLUMN training_id SET DEFAULT nextval('public.pharmacy_training_training_id_seq'::regclass);


--
-- TOC entry 4705 (class 2604 OID 16461)
-- Name: rules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rules ALTER COLUMN id SET DEFAULT nextval('public.rules_id_seq'::regclass);


--
-- TOC entry 4706 (class 2604 OID 16462)
-- Name: training id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training ALTER COLUMN id SET DEFAULT nextval('public.training_id_seq'::regclass);


--
-- TOC entry 4707 (class 2604 OID 16463)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4709 (class 2604 OID 16464)
-- Name: vn_blurbs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vn_blurbs ALTER COLUMN id SET DEFAULT nextval('public.vn_blurbs_id_seq'::regclass);


--
-- TOC entry 4711 (class 2606 OID 16466)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 4713 (class 2606 OID 16468)
-- Name: pharmacies pharmacies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacies
    ADD CONSTRAINT pharmacies_pkey PRIMARY KEY (id);


--
-- TOC entry 4715 (class 2606 OID 16470)
-- Name: pharmacy_blurbs pharmacy_blurbs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_blurbs
    ADD CONSTRAINT pharmacy_blurbs_pkey PRIMARY KEY (blurb_id, pharmacy_id);


--
-- TOC entry 4717 (class 2606 OID 16472)
-- Name: pharmacy_contacts pharmacy_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_contacts
    ADD CONSTRAINT pharmacy_contacts_pkey PRIMARY KEY (pharmacy_id, contact_id);


--
-- TOC entry 4719 (class 2606 OID 16474)
-- Name: pharmacy_rules pharmacy_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_rules
    ADD CONSTRAINT pharmacy_rules_pkey PRIMARY KEY (pharmacy_id, rules_id);


--
-- TOC entry 4721 (class 2606 OID 16476)
-- Name: pharmacy_training pharmacy_training_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_training
    ADD CONSTRAINT pharmacy_training_pkey PRIMARY KEY (pharmacy_id, training_id);


--
-- TOC entry 4723 (class 2606 OID 16478)
-- Name: rules rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_pkey PRIMARY KEY (id);


--
-- TOC entry 4725 (class 2606 OID 16480)
-- Name: training training_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training
    ADD CONSTRAINT training_pkey PRIMARY KEY (id);


--
-- TOC entry 4728 (class 2606 OID 16482)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4730 (class 2606 OID 16486)
-- Name: vn_blurbs vn_blurbs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vn_blurbs
    ADD CONSTRAINT vn_blurbs_pkey PRIMARY KEY (id);


--
-- TOC entry 4726 (class 1259 OID 16528)
-- Name: unique_lower_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_lower_username ON public.users USING btree (lower(username));


--
-- TOC entry 4731 (class 2606 OID 16487)
-- Name: pharmacy_blurbs fk_blurb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_blurbs
    ADD CONSTRAINT fk_blurb FOREIGN KEY (blurb_id) REFERENCES public.vn_blurbs(id);


--
-- TOC entry 4732 (class 2606 OID 16492)
-- Name: pharmacy_blurbs fk_pharm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_blurbs
    ADD CONSTRAINT fk_pharm FOREIGN KEY (pharmacy_id) REFERENCES public.pharmacies(id);


--
-- TOC entry 4733 (class 2606 OID 16497)
-- Name: pharmacy_contacts pharmacy_contacts_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_contacts
    ADD CONSTRAINT pharmacy_contacts_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id) NOT VALID;


--
-- TOC entry 4734 (class 2606 OID 16502)
-- Name: pharmacy_contacts pharmacy_contacts_pharmacy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_contacts
    ADD CONSTRAINT pharmacy_contacts_pharmacy_id_fkey FOREIGN KEY (pharmacy_id) REFERENCES public.pharmacies(id) NOT VALID;


--
-- TOC entry 4735 (class 2606 OID 16507)
-- Name: pharmacy_rules pharmacy_rules_pharmacy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_rules
    ADD CONSTRAINT pharmacy_rules_pharmacy_id_fkey FOREIGN KEY (pharmacy_id) REFERENCES public.pharmacies(id);


--
-- TOC entry 4736 (class 2606 OID 16512)
-- Name: pharmacy_rules pharmacy_rules_rules_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_rules
    ADD CONSTRAINT pharmacy_rules_rules_id_fkey FOREIGN KEY (rules_id) REFERENCES public.rules(id);


--
-- TOC entry 4737 (class 2606 OID 16517)
-- Name: pharmacy_training pharmacy_training_pharmacy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_training
    ADD CONSTRAINT pharmacy_training_pharmacy_id_fkey FOREIGN KEY (pharmacy_id) REFERENCES public.pharmacies(id);


--
-- TOC entry 4738 (class 2606 OID 16522)
-- Name: pharmacy_training pharmacy_training_training_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_training
    ADD CONSTRAINT pharmacy_training_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.training(id);


-- Completed on 2025-07-16 09:58:46

--
-- PostgreSQL database dump complete
--

