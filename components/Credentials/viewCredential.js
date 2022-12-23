import { Image, Row, Col, Button } from "antd";
import { useRouter } from "next/router";
import { useRef } from "react";

import styles from "./viewCredential.module.css";
import GeneratePDF from "../utils/GeneratePDF";

export default function ViewCredential({ Certificate, CredentialType }) {
  const router = useRouter();

  const deleteCertificate = async () => {
    const res = await fetch("/api/educator/certificates/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: Certificate._id,
      }),
    });
    const data = await res.json();
    console.log(data);

    router.push("/educator/certificates");
  };

  const pdfRef = useRef();

  return (
    <div>
      <Row className={styles.view_cert_container} wrap>
        <Col
          className={styles.view_cert_section1}
          span={12}
          xs={{
            span: 24,
          }}
          sm={{
            span: 12,
          }}
          lg={{
            span: 12,
          }}
        >
          {CredentialType === "certificate"
            ?
            <div className={styles.content} ref={pdfRef}>
              <div>
                <div className={styles.subContent}>
                  <h1 className={styles.userName}>username</h1>
                  <hr style={{ width: "100%" }} />
                  <p id="text" className={styles.paragraph}>
                    {Certificate.title}
                  </p>
                  <p id="text" className={styles.paragraph2}>
                    {Certificate.desc}
                  </p>
                </div>
                <div className={styles.subContent2}>
                  <img
                    src="/images/signatureCred.png"
                    alt="this is the signature"
                    className={styles.signature}
                  />
                  <hr style={{ width: "100%" }} />
                  <img
                    src="/images/logo-stud.svg"
                    alt="this is the credBLOCK logo"
                    className={styles.logo}
                  />
                </div>
              </div>
            </div>
            :
            <Image
              src="/images/resetPwd.jpg"
              alt="credential pdf file "
              fill="true"
              priority="true"
              className={styles.view_cert_image}
            />
          }
        </Col>
        <Col
          span={12}
          className={styles.view_cert_section2}
          xs={{
            span: 24,
          }}
          sm={{
            span: 12,
          }}
          lg={{
            span: 12,
          }}
        >
          <Row>
            <Col span={24}>
              <Row>
                <Col span={24}>
                  <label htmlFor="" className={styles.view_cert_labels}>
                    Id
                  </label>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <p className={styles.view_cert_texts}>{Certificate._id}</p>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <label htmlFor="" className={styles.view_cert_labels}>
                    Title
                  </label>
                </Col>
                <Col>
                  <a
                    className={styles.view_cert_link}
                    type="text"
                    primary="true"
                  >
                    Edit
                  </a>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <p className={styles.view_cert_texts}>{Certificate.title}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col span={24}>
                  <label htmlFor="" className={styles.view_cert_labels}>
                    Date and Time
                  </label>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <p className={styles.view_cert_texts}>{Certificate.dateIssued}</p>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <label htmlFor="" className={styles.view_cert_labels}>
                    Description
                  </label>
                </Col>
                <Col>
                  <a
                    className={styles.view_cert_link}
                    type="text"
                    primary="true"
                  >
                    Edit
                  </a>
                </Col>
              </Row>
            </Col>
            <Col>
              <p className={styles.view_cert_texts}>{Certificate.desc}</p>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <label htmlFor="" className={styles.view_cert_labels}>
                    Group
                  </label>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <p className={styles.view_cert_texts}>Group 1</p>
            </Col>
          </Row>
          <Row style={{ width: "100%" }} justify="space-between" align="middle" >

            {CredentialType === "certificate"
              ?
              <>
                <Col span={12}>
                  <GeneratePDF html={pdfRef} />
                </Col>
                <Col span={12}>
                  <Button
                    onClick={deleteCertificate}
                    style={{ width: "90%" }}
                    type="danger"
                  >
                    Delete
                  </Button>
                </Col>
              </>
              :
              <Col span={24}>
                <Button
                  onClick={deleteCertificate}
                  style={{ width: "100%" }}
                  type="danger"
                >
                  Delete
                </Button>
              </Col>
            }

          </Row>
        </Col>
      </Row>
    </div>
  );
}
