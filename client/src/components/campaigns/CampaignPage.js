import { useParams } from 'react-router-dom';

function CampaignPage() {
    const { campaignId } = useParams();

    return (
        <>
            <p>Campaign with id: {campaignId}</p>
        </>
    );
};

export default CampaignPage;