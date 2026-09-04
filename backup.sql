--
-- PostgreSQL database dump
--

\restrict VuG5NHMpNEEiKxOpN9Q2FzXdf39wqmSAYVjd5StbwyjJZ9dodbbV4TTlbXPcLxS

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4


SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;

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
-- Name: attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    student_id character varying(20) NOT NULL,
    subject character varying(50) NOT NULL,
    status character varying(10) NOT NULL,
    date date DEFAULT CURRENT_DATE
);




--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: marks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marks (
    id integer NOT NULL,
    student_id character varying(20) NOT NULL,
    exam_type character varying(30) NOT NULL,
    math integer,
    physics integer,
    english integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);




--
-- Name: marks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marks_id_seq OWNED BY public.marks.id;


--
-- Name: remarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.remarks (
    id integer NOT NULL,
    student_id character varying(20) NOT NULL,
    remark text NOT NULL,
    date date DEFAULT CURRENT_DATE
);


--
-- Name: remarks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.remarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: remarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.remarks_id_seq OWNED BY public.remarks.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    student_id character varying(20) NOT NULL,
    class_name character varying(10) NOT NULL,
    section character varying(5) NOT NULL
);




--
-- Name: timetable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.timetable (
    id integer NOT NULL,
    class_name character varying(10) NOT NULL,
    day character varying(20) NOT NULL,
    p1_subject character varying(50),
    p1_teacher character varying(10),
    p2_subject character varying(50),
    p2_teacher character varying(10),
    p3_subject character varying(50),
    p3_teacher character varying(10),
    p4_subject character varying(50),
    p4_teacher character varying(10),
    p5_subject character varying(50),
    p5_teacher character varying(10)
);




--
-- Name: timetable_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.timetable_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: timetable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.timetable_id_seq OWNED BY public.timetable.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(20) NOT NULL,
    password character varying(100) NOT NULL,
    role character varying(20) NOT NULL
);




--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: marks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks ALTER COLUMN id SET DEFAULT nextval('public.marks_id_seq'::regclass);


--
-- Name: remarks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remarks ALTER COLUMN id SET DEFAULT nextval('public.remarks_id_seq'::regclass);


--
-- Name: timetable id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timetable ALTER COLUMN id SET DEFAULT nextval('public.timetable_id_seq'::regclass);


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (id, student_id, subject, status, date) FROM stdin;
1	S1001	Mathematics	Present	2026-08-07
2	S1001	Science	Present	2026-08-07
3	S1001	English	Absent	2026-08-07
4	S1001	Social	Present	2026-08-16
5	S1001	Telugu	Absent	2026-08-19
6	S1001	Computer	Absent	2026-08-21
\.


--
-- Data for Name: marks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marks (id, student_id, exam_type, math, physics, english, created_at) FROM stdin;
1	S1001	Quarterly	85	90	78	2026-08-07 12:35:48.89977
2	S1001	Half-Yearly	88	92	80	2026-08-07 12:35:48.89977
3	S1001	Annual	99	89	88	2026-08-13 17:51:11.560633
4	s1001	Half-Yearly	99	89	88	2026-08-13 20:54:07.410814
\.


--
-- Data for Name: remarks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.remarks (id, student_id, remark, date) FROM stdin;
1	S1001	Excellent performance in Mathematics!	2026-08-07
2	S1001	Needs to improve English writing skills.	2026-08-07
3	S1001	improve	2026-08-21
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (student_id, class_name, section) FROM stdin;
S1001	6	A
S1002	6	A
S1003	6	B
\.


--
-- Data for Name: timetable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.timetable (id, class_name, day, p1_subject, p1_teacher, p2_subject, p2_teacher, p3_subject, p3_teacher, p4_subject, p4_teacher, p5_subject, p5_teacher) FROM stdin;
1	6A	Monday	Math	T101	English	T102	Science	T103	Social	T104	Telugu	T105
2	6A	Tuesday	English	T102	Social	T102	Computer	T106	Science	T103	Hindi	T107
3	6A	Wednesday	Science	T103	Math	T101	English	T102	Telugu	T105	Social	T104
4	6A	Thursday	Math	T101	Computer	T106	Science	T103	English	T102	Hindi	T107
5	6A	Friday	English	T102	Math	T101	Social	T104	Science	T103	Maths	T101
6	6A	Saturday	Telugu	T105	Hindi	T107	Computer	T106	Math	T101	Library	T109
7	6B	Monday	Social	T104	Telugu	T105	Math	T101	English	T102	Science	T103
8	6B	Tuesday	Math	T101	Science	T103	English	T102	Hindi	T107	Computer	T106
9	6B	Wednesday	Math	T101	Telugu	T105	Science	T103	Social	T104	N/A	\N
10	6B	Thursday	Science	T103	Math	T101	English	T102	Computer	T106	Hindi	T107
11	6B	Friday	Math	T101	English	T102	Science	T103	Social	T104	Games	T108
12	6B	Saturday	Hindi	T107	Telugu	T105	Math	T101	Computer	T106	Library	T109
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, password, role) FROM stdin;
T1001	teacher123	Teacher
PA1001	parent123	Parent
S1002	pass123	student
S1003	pass123	student
S1001	student123	student
P1001	principal123	principal
\.


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_id_seq', 6, true);


--
-- Name: marks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.marks_id_seq', 4, true);


--
-- Name: remarks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.remarks_id_seq', 3, true);


--
-- Name: timetable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.timetable_id_seq', 12, true);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: marks marks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_pkey PRIMARY KEY (id);


--
-- Name: remarks remarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remarks
    ADD CONSTRAINT remarks_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (student_id);


--
-- Name: timetable timetable_class_name_day_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timetable
    ADD CONSTRAINT timetable_class_name_day_key UNIQUE (class_name, day);


--
-- Name: timetable timetable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timetable
    ADD CONSTRAINT timetable_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: students students_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict VuG5NHMpNEEiKxOpN9Q2FzXdf39wqmSAYVjd5StbwyjJZ9dodbbV4TTlbXPcLxS

