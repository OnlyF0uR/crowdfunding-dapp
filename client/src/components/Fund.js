import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function FundCreate() {
    const [duration, setDuration] = useState('7');
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        shortDesc: '',
        longDesc: '',
        goal: '',
        email: ''
    });
    const [validated, setValidated] = useState(false);

    const handeChange = (d, e) => {
        e.preventDefault();

        const c = formData;
        c[d] = e.target.value;
        setFormData(c);
    }

    const handleFileUpload = (e) => {
        e.preventDefault();

        const c = formData;
        const img = e.target.files[0];

        if (img.type !== 'image/jpg' && img.type !== 'image/png' && img.type !== 'image/jpeg') {
            alert('Only png, jpg and jpeg are supported.');

            // Rejected, set current values to ''
            e.target.value = '';
            c.image = '';
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(img);

        reader.onload = (e) => {
            c.image = e.target.result;

            console.log(c.image)
            setFormData(c);
        }
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);

        /**
         * TODO:
         *  - Generate a random secret
         *  - Sign the transaction with the blockchain
         *  - Collect data
         *  - Send data to the backend along with the random secret
         */
    };

    return (
        <div style={{ marginTop: '75px', marginRight: '150px', marginLeft: '150px' }}>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="My awesome campaign" onChange={(e) => handeChange('title', e)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Short Description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="A brief description of max 50 words." onChange={(e) => handeChange('shortDesc', e)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Long Description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="A detailed description between 250 and 500 words." onChange={(e) => handeChange('longDesc', e)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Image (500x300)</Form.Label>
                    <Form.Control type="file" accept=".jpg, .jpeg, .png" onChange={handleFileUpload} required />
                </Form.Group>

                <Form.Label>Duration ({duration} days)</Form.Label>
                <Form.Range min="1" max="90" defaultValue="7" onChange={(e) => setDuration(e.target.value)} required />

                {/* TODO: Add goal */}

                <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(e) => handeChange('email', e)} />
                    <Form.Text className="text-muted">
                        We'll notify you when your campaign is verified.
                    </Form.Text>
                </Form.Group>

                {/* Center this xD */}
                <Form.Group className="mb-3">
                    <Form.Check
                        required
                        label="Agree to terms and conditions"
                        feedback="You must agree before submitting."
                        feedbackType="invalid"
                    />
                </Form.Group>

                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </div>
    );
};

function FundList() {
    return (
        <div style={{ marginTop: '75px' }}>
            <p>Fund list</p>
        </div>
    );
};

function FundDocs() {
    return (
        <div style={{ marginTop: '75px' }}>
            <p>Fund docs</p>
        </div>
    );
};

export {
    FundCreate,
    FundList,
    FundDocs
};