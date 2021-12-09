import { useParams } from 'react-router-dom';

// A campaign can be pending, active or expired.
function CampaignPage() {
    const { campaignId } = useParams();

    return (
        <>
            <p>Campaign with id: {campaignId}</p>
        </>
    );
};

export default CampaignPage;