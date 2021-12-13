-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns(
    id SERIAL PRIMARY KEY,
    account VARCHAR NOT NULL,
    currency VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    short_desc TEXT NOT NULL,
    long_desc TEXT NOT NULL,
    goal decimal NOT NULL,
    img TEXT NOT NULL,
    category VARCHAR NOT NULL,
    expires BIGINT NOT NULL,
    verified BOOLEAN NOT NULL
);

INSERT INTO campaigns(id, account, currency, title, short_desc, long_desc, goal, img, category, expires, verified) VALUES (0, '0x27bF96EbB3bB2C0cD6F9bE9f063A3fDe408770b0', 'ETH', 'My new project', 'Hi all! I would like to start my new project the only problem I ran into is that i need some funding to kickstart it. That is why I created this funding campaign on this amazing platform.', 'THIS DESCRIPTION IS SO FREAKING LONG MATE THIS IS BLOODY INSANE I TELL YOU', 12.5, 'no img here', 'hot', 1739419113, true);

INSERT INTO campaigns(id, account, currency, title, short_desc, long_desc, goal, img, category, expires, verified) VALUES (2, '0x27bF96EbB3bB2C0cD6F9bE9f063A3fDe408770b0', 'ETH', 'My new project', 'Hi all! I would like to start my new project the only problem I ran into is that i need some funding to kickstart it. That is why I created this funding campaign on this amazing platform.', 'THIS DESCRIPTION IS SO FREAKING LONG MATE THIS IS BLOODY INSANE I TELL YOU', 15.5, 'no img here', 'hot', 1639419143, true);

INSERT INTO campaigns(id, account, currency, title, short_desc, long_desc, goal, img, category, expires, verified) VALUES (3, '0x27bF96EbB3bB2C0cD6F9bE9f063A3fDe408770b0', 'ETH', 'My new project', 'Hi all! I would like to start my new project the only problem I ran into is that i need some funding to kickstart it. That is why I created this funding campaign on this amazing platform.', 'THIS DESCRIPTION IS SO FREAKING LONG MATE THIS IS BLOODY INSANE I TELL YOU', 25.25, 'no img here', 'launchpad', 1739419113, true);