import { PlusOutlined } from '@ant-design/icons';
import { Upload, Form } from 'antd';

const InputImageProving = ({
    label = "Ảnh minh chứng",
    name = "images"
}) => {
    return (
        <Form.Item
            label={label}
            name={name}
            getValueFromEvent={(e) => {
                if (!e) return [];
                return e.fileList.map(file => file.originFileObj).filter(Boolean);
            }}
        >
            <Upload
                listType="picture-card"
                accept="image/*"
                multiple
                maxCount={3}
                beforeUpload={() => false}
            >
                <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh</div>
                </div>
            </Upload>
        </Form.Item>
    );
}

export default InputImageProving