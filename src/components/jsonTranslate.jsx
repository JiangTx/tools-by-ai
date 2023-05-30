import React, { useState } from "react";
import {
  Button,
  Input,
  Layout,
  Row,
  Col,
  Typography,
  message,
  Select,
  Form,
  Spin,
  Card
} from "antd";
import axios from "axios";
import NavBar from "../NavBar";
import { Helmet } from "react-helmet";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Component for label and input box
const LabeledInput = ({label, value, onChange}) => (
  <Form.Item label={label}>
    <Input value={value} onChange={onChange} />
  </Form.Item>
);

// Component for label and select box
const LabeledSelect = ({label, value, onChange, options}) => (
  <Form.Item label={label}>
    <Select value={value} onChange={onChange}>
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

const Translate = () => {
  const [result, setResult] = useState("");
  const [inputText, setInputText] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [inputKey, setInputKey] = useState("displayName");
  const [outputKey, setOutputKey] = useState("langName");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("zh-CN");
  const [isLoading, setIsLoading] = useState(false);

  // Add your supported languages here
  const languages = [
    { value: "en", label: "English" },
    { value: "zh-CN", label: "中文" },
    { value: "ja", label: "日语" },
    { value: "ko", label: "韩语" },
    { value: "es", label: "西班牙语" },
    // Add more languages as needed...
  ];

  const handleTranslateClick = async () => {
    setIsLoading(true);  // Add this line
    const input = JSON.parse(inputText);
    const translatedData = await translateNode(input, inputKey, outputKey);
    setResult(JSON.stringify(translatedData, null, 2));
    setIsLoading(false);  // Add this line
  };

  const translateText = async (text) => {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    try {
      const response = await axios.post(url, {
        q: text,
        target: targetLanguage,
        source: sourceLanguage,
      });
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      return "";
    }
  };

  const handleCopyResultClick = () => {
    navigator.clipboard.writeText(result).then(
      () => {
        message.success("结果已复制到剪贴板");
      },
      (err) => {
        message.error("无法复制结果，请手动复制");
      }
    );
  };

  const translateNode = async (node, inputKey, outputKey, depth = 0) => {
    let newObj = {};
    for (let key in node) {
      if (typeof node[key] === "object") {
        newObj[key] = await translateNode(node[key], inputKey, outputKey, depth + 1);
      } else {
        if (key === inputKey) {
          let textToTranslate = node[key];
          if (textToTranslate) { // Check if the text to translate is not empty
            const translatedText = await translateText(textToTranslate);
            newObj[outputKey] = translatedText;
          } else {
            newObj[key] = node[key]; // If the text to translate is empty, just copy it as it is
          }
        } else {
          newObj[key] = node[key];
        }
      }
    }
    return newObj;
  };


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Helmet>
        <title>i18n JSON 翻译</title>
      </Helmet>
      <NavBar />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Layout.Content
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}
        >
          <Title level={3} style={{ marginBottom: "24px" }}>
            机器翻译 JSON 节点
          </Title>
          <Typography.Paragraph
            type="secondary"
            style={{ fontSize: "14px", marginBottom: "20px" }}
          >
            本页面的主要目的是将用户输入的文本翻译成中文。页面上方设置有输入框，用于输入
            API Key，下方设置有另一个输入框，用于输入要翻译的 JSON
            文本。在输入相应的内容后，点击“翻译文本”按钮，系统会调用 Google
            Translate
            API，将输入文本翻译成中文。翻译完成后，翻译结果将显示在右侧的结果文本框中。
            此处设定翻译原文是 displayName 的值（英文），然后将 langName
            的值设为翻译后的内容（中文）。你可以根据需要进行调整。如果没有
            API，可查看
            <a href="https://docs.easyuseai.com/platform/translate/google_fanyi.html">
              接口申请教程
            </a>
            。已经申请好了，可以直接查看
            <a href="https://console.cloud.google.com/apis/credentials/key/2c5756a5-5a4c-4d48-993f-e478352dcc64?project=ordinal-nucleus-383814">
              当前 API
            </a>
            。
          </Typography.Paragraph>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="输入">
                <Form>
                  <LabeledInput
                    label="API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <LabeledSelect
                    label="源语言"
                    value={sourceLanguage}
                    onChange={setSourceLanguage}
                    options={languages}
                  />
                  <LabeledSelect
                    label="目标语言"
                    value={targetLanguage}
                    onChange={setTargetLanguage}
                    options={languages}
                  />
                  <LabeledInput
                    label="输入键名"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                  />
                  <LabeledInput
                    label="输出键名"
                    value={outputKey}
                    onChange={(e) => setOutputKey(e.target.value)}
                  />
                  <Form.Item label="要翻译的文本">
                    <TextArea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      rows={10}
                    />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="输出">
                <Button
                  onClick={handleTranslateClick}
                  style={{ marginBottom: "16px" }}
                >
                  翻译文本
                </Button>
                <Button
                  onClick={handleCopyResultClick}
                  style={{ marginLeft: "16px", marginBottom: "16px" }}
                >
                  复制结果
                </Button>
                <Spin spinning={isLoading}>
                  <TextArea
                    placeholder="翻译结果"
                    value={result}
                    readOnly
                    rows={10}
                  />
                </Spin>
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </div>
    </Layout>
  );
};

export default Translate;
/* 
下面是节点的测试数据，以上将 "Post-processing"、"Post-processing" 类似的位置都做了翻译，并替代原本的位置。
{
  "Post-processing": {
    "Reflection": [{
        "displayName": "Ray Tracing Reflections",
        "langName": "中"
      },
      {
        "displayName": "Lumen Reflections",
        "langName": "中 2"
      },
      {
        "displayName": "Screen Space Reflections",
        "langName": "中 3"
      },
      {
        "displayName": "Diffraction Grading",
        "langName": "中 4"
      }
    ],
    "Filters": [{
        "displayName": "Chromatic Aberration",
        "langName": "中 5"
      }
    ],
    "Shaders": [{
        "displayName": "Ray Traced",
        "langName": "中 6"
      },
      {
        "displayName": "Ray Tracing Ambient Occlusion",
        "langName": "中 7"
      }
    ]
  },
  "Advanced": {
    "Compound Details": [{
        "displayName": "in a symbolic and meaningful style",
        "langName": "中 8"
      },
      {
        "displayName": "detailed and intricate",
        "langName": "中 9"
      }
    ]
  }
} */
