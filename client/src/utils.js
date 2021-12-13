/**
 * roundNumber
 * @param {integer} n the number to round 
 * @param {integer} dF the digitFactor, 100 for 2 decimals, 1000 for 3 decimals etc.
 * @returns the rounded number
 */
export function roundNumber(n, dF) {
    // digitFactor:
    // 100 for 2 decimals, 1000 for 3 etc.
    return Math.round(n * dF) / dF;
};

export function getCampaigns(preview = true, page = 1) {
    if (preview) {
        return {
            "hot": [
                {
                    id: 0,
                    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1102&q=80',
                    title: 'My new project',
                    adr: '0xaACC88D8C3D9bFdd781dEa1381c073E205796970',
                    desc: 'Hi all! I would like to start my new project the only problem I ran into is that i need some funding to kickstart it. That\'s why I created this funding campaign on this amazing platform.',
                    prog: {
                        curr: 'ETH',
                        goal: 10,
                        current: 6.7884632121
                    }
                },
                {
                    id: 1,
                    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y3J5cHRvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                    title: 'Lorem ipsum',
                    adr: '0xaACC88D8C3D9bFdd781dEa1381c073E205796970',
                    desc: 'dolor sit amet.',
                    prog: {
                        curr: 'ETH',
                        goal: 50,
                        current: 6.7884632121
                    }
                }
            ],
            "charity": [
                {
                    id: 2,
                    image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNyeXB0b3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
                    title: 'Big bruv mate',
                    desc: 'Hi all! I would like to start my new project the only problem I ran into is that i need some funding to kickstart it. That\'s why I created this funding campaign on this amazing platformawddddddddddddddddddddddddddddd.',
                    adr: '0xaACC88D8C3D9bFdd781dEa1381c073E205796970',
                    prog: {
                        curr: 'ETH',
                        goal: 1000,
                        current: 6.7884632121
                    }
                }
            ],
            "startup": [],
            "launchpad": []
        };
    } else {
        // TODO: Fetch information from the database
        // Use page variable get the appropiate information
        return {
            "hot": [],
            "charity": [],
            "startup": [],
            "launchpad": []
        };
    }
};

export function getCampaign(id) {
    // TODO: Fetch a particular campaign from the website
    return null;
};