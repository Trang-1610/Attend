import { Tabs } from "antd";

const TabTimeTable = ({ items, activeTab, setActiveTab }) => {
    return (
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    );
}

export default TabTimeTable