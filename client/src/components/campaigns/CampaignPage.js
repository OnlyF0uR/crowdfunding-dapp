import Navbar from '../Navbar';
import { useParams } from 'react-router-dom';

function CampaignPage() {
    const { campaignId } = useParams();

    return (
        <>
            <Navbar />
            <p>Campaign with id: {campaignId}</p>
        </>
    );
};

export default CampaignPage;