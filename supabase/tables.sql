-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.attendees (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    cpf text NOT NULL UNIQUE,
    full_name text NOT NULL,
    email text,
    created_at timestamp
    with
        time zone DEFAULT now(),
        updated_at timestamp
    with
        time zone DEFAULT now(),
        CONSTRAINT attendees_pkey PRIMARY KEY (id)
);

CREATE TABLE public.event_optins (
    event_id uuid NOT NULL,
    attendee_id uuid NOT NULL,
    created_at timestamp
    with
        time zone DEFAULT now(),
        updated_at timestamp
    with
        time zone DEFAULT now(),
        CONSTRAINT event_optins_pkey PRIMARY KEY (event_id, attendee_id),
        CONSTRAINT event_optins_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events (id),
        CONSTRAINT event_optins_attendee_id_fkey FOREIGN KEY (attendee_id) REFERENCES public.attendees (id)
);

CREATE TABLE public.events (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    name text NOT NULL,
    location text,
guests jsonb,
    datetime timestamp
    with
        time zone,
        link text,
        image_url text,
        pix_key text,
        admin_id uuid NOT NULL,
        created_at timestamp
    with
        time zone DEFAULT now(),
        updated_at timestamp
    with
        time zone DEFAULT now(),
        CONSTRAINT events_pkey PRIMARY KEY (id),
        CONSTRAINT events_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users (id)
);