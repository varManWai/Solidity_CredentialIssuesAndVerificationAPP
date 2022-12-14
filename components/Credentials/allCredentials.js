import CertificateGrid from "./credentialsGrid";

import {
  Alert,
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useState, useCallback, useEffect } from "react";

import Loader from "../Layout/loader";

import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

import styles from "./allCredentials.module.css";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function AllCertificate({ Certificates, path, groupsArr }) {
  const router = useRouter();

  const { TextArea } = Input; // for text area field
  const [open, setOpen] = useState(false); //for drawer

  const onClose = () => {
    setOpen(false);
  };

  //FORM Attributes
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dateIssued, setDateIssued] = useState("");
  const [imageAddress, setImageAddress] = useState("");

  const [groupID, setGroupID] = useState('');


  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const openWidget = () => {
    // create the widget
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dhfvht9ju",
        uploadPreset: "ml_default",
      },
      (error, result) => {
        if (
          result.event === "success" &&
          result.info.resource_type === "image"
        ) {
          // console.log(result.info);
          setImageAddress(result.info.public_id);
        }
      }
    );
    widget.open(); // open up the widget after creation
  };

  const createCertificate = async (event) => {


    if (path === "certificates") {
      setLoading(true);

      // console.log("the blockchain stuff start from here");

      const accounts = await web3.eth.getAccounts();

      // console.log(accounts);

      try {

        const dateTime = new Date().toLocaleString();

        await factory.methods.createCertificate(title, desc, dateTime).send({
          from: accounts[0],
        });

        const certAddress = await factory.methods.getDeployedCertificates().call();

        // console.log(certAddress);

        const res = await fetch(`/api/educator/${path}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            desc: desc,
            dateIssued: dateTime,
            address: certAddress[certAddress.length - 1],
            educatorEmail: session.user.email,
            groupID: groupID,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Something went wrong!');
        }
        setError("")
        setImageAddress("");
        setLoading(false);
        onClose();
        router.push(`/educator/${path}`);

      } catch (err) {
        // console.log(err);
        setError(err.message);
      }
    }

    if (path === "badges") {
      setLoading(true);

      // console.log("the blockchain stuff start from here");

      const accounts = await web3.eth.getAccounts();

      // console.log(accounts);

      try {

        const dateTime = new Date().toLocaleString();

        await factory.methods.createBadge(title, desc, dateTime).send({
          from: accounts[0],
        });

        const badgeAddress = await factory.methods.getDeployedBadges().call();

        // console.log(badgeAddress);

        const res = await fetch(`/api/educator/${path}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            desc: desc,
            dateIssued: dateTime,
            address: badgeAddress[badgeAddress.length - 1],
            imageAddress: imageAddress,
            educatorEmail: session.user.email,
            groupID: groupID,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Something went wrong!');
        }

        setError("")
        setImageAddress("");
        setLoading(false);
        onClose();
        router.push(`/educator/${path}`);

      } catch (err) {
        // console.log(err);
        setError(err.message);
      }
    }

    setLoading(false);
  };

  //code for responsive - start
  const useMediaQuery = (width) => {
    const [targetReached, setTargetReached] = useState(false);

    const updateTarget = useCallback((e) => {
      if (e.matches) {
        setTargetReached(true);
      } else {
        setTargetReached(false);
      }
    }, []);

    useEffect(() => {
      const media = window.matchMedia(`(max-width: ${width}px)`);
      media.addEventListener("change", updateTarget);

      // Check on mount (callback is not called until a change occurs)
      if (media.matches) {
        setTargetReached(true);
      }

      return () => media.removeEventListener("change", updateTarget);
    }, []);

    return targetReached;
  };

  const isBreakpoint = useMediaQuery(925);
  //code for responsive - end

  //group selector - start
  const handleChange = (value) => {
    setGroupID(value);
  };
  //group selector - end

  return (
    <div className={styles.all_certificates_section}>
      <div className={styles.add_new_cert}>
        <Button
          style={{
            marginRight: "2.5vw",
          }}
          icon={<PlusOutlined />}
          onClick={
            isBreakpoint
              ? () => {
                router.push(`/educator/${path}/add`);
              }
              : () => {
                setOpen(true);
              }
          }
          type="primary"
        >
          New
        </Button>
      </div>
      <Drawer
        title={`Create a new ${path}`}
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={createCertificate} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        {loading ? (
          <Loader />
        ) : (
          <Form
            layout="vertical"
            requiredMark
            onSubmitCapture={createCertificate}
          >
            {error
              ?
              <div style={{ marginBottom: "15px" }}>
                <Alert message={`Error: ${error}`} type="error" />
              </div>
              :
              ''
            }
            <Row gutter={16}>
              <Col span={path === "certificates" ? 24 : 12}>
                <Form.Item name="title" label="Title">
                  <Input
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                    required
                    minLength="1"
                    maxLength="256"
                  />
                </Form.Item>
              </Col>
              {path === "certificates" ? (
                ""
              ) : (
                <Col span={isBreakpoint ? 24 : 12}>
                  <Form.Item label="Badge Image">
                    <Button
                      onClick={openWidget}
                      type="primary"
                      style={{ width: "100%" }}
                    >
                      Upload
                    </Button>
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Description">
                  <TextArea
                    rows={4}
                    value={desc}
                    onChange={(event) => {
                      setDesc(event.target.value);
                    }}
                    required
                    minLength="1"
                    maxLength="1024"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Group">
                  <Select
                    defaultValue="Select your group"
                    style={{
                      width: "100%",
                    }}
                    onChange={handleChange}
                    options={groupsArr}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Drawer>
      <CertificateGrid items={Certificates} specDeletePath={path} />
    </div>
  );
}
