import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

function GoogleDriveUploader() {
  const [showFileAlert, setShowFileAlert] = useState("true");
  const course = [
    {
      label: "BCA",
      value: "bca",
      sems: [
        { label: "Semsester 1", value: "sem1", subject: [] },
        { label: "Semsester 2", value: "sem2", subject: [] },
        { label: "Semsester 3", value: "sem3", subject: [] },
        { label: "Semsester 4", value: "sem4", subject: [] },
        {
          label: "Semsester 5",
          value: "sem5",
          subject: [
            { label: "Computer Architecture", value: "ca" },
            { label: "OOPs using Java", value: "java" },
            { label: "Micro Processor and ALP", value: "mp" },
            { label: "Software Engineering", value: "se" },
            { label: "Data Communication and Networks", value: "dcn" },
          ],
        },
        { label: "Semsester 6", value: "sem6", subject: [] },
      ],
    },
    {
      label: "Bcom",
      value: "bcom",
      sems: [
        {
          label: "Sem",
          options: [
            { label: "Semsester 1", value: "sem1" },
            { label: "Semsester 2", value: "sem2" },
            { label: "Semsester 3", value: "sem3" },
            { label: "Semsester 4", value: "sem4" },
            { label: "Semsester 5", value: "sem5" },
            { label: "Semsester 6", value: "sem6" },
          ],
        },
      ],
    },
    {
      label: "BA",
      value: "ba",
      sems: [
        {
          label: "Sem",
          options: [
            { label: "Semsester 1", value: "sem1" },
            { label: "Semsester 2", value: "sem2" },
            { label: "Semsester 3", value: "sem3" },
            { label: "Semsester 4", value: "sem4" },
            { label: "Semsester 5", value: "sem5" },
            { label: "Semsester 6", value: "sem6" },
          ],
        },
      ],
    },
  ];

  const fileSchema = yup.object().shape({
    file: yup.mixed().required("File is required"),
    course: yup.string().required(),
    sem: yup.string().required(),
    subject: yup.string().required(),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log("test", values);
    var formData = new FormData();
    formData.append("file", values.file);
    formData.append("course", values.course);
    formData.append("sem", values.sem);
    formData.append("subject", values.subject);
    console.log("test", formData);
    await axios
      .post("/upload-to-google-drive", formData)
      .then((response) => {
        setSubmitting(false);
      })
      .catch((error) => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <Formik
        validationSchema={fileSchema}
        onSubmit={handleSubmit}
        initialValues={{
          file: null,
          course: "",
          sem: "",
          subject: "",
        }}
      >
        {({
          handleSubmit,
          handleChange,
          setFieldValue,
          values,
          touched,
          isValid,
          errors,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Upload file
                <Alert
                  variant="warning"
                  show={showFileAlert}
                  onClose={() => setShowFileAlert(false)}
                  dismissible
                >
                  Only PDF file is supported ! You can also drag and drop the
                  file !
                </Alert>
              </Form.Label>
              <Form.Control
                type="file"
                name="file"
                accept="application/pdf"
                multiple={false}
                size="lg"
                isValid={touched.file && !errors.file}
                isInvalid={!!errors.file}
                onChange={(event) =>
                  setFieldValue("file", event.currentTarget.files[0])
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.file}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Select Course
                <br />
              </Form.Label>
              <Form.Select
                name="course"
                value={values.course}
                onChange={handleChange}
                isValid={touched.course && !errors.course}
                isInvalid={!!errors.course}
              >
                <option value=""> Select Course</option>
                {course.map((courses, i) => (
                  <option key={i} value={courses.value}>
                    {courses.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.course}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Select Semester
                <br />
              </Form.Label>
              {values.course && (
                <Form.Select
                  name="sem"
                  value={values.sem}
                  onChange={handleChange}
                  isValid={touched.sem && !errors.sem}
                  isInvalid={!!errors.sem}
                >
                  <option value=""> Select Semester</option>
                  {course
                    .find((course) => course.value === values.course)
                    .sems.map((sem, i) => (
                      <option key={i} value={sem.value}>
                        {" "}
                        {sem.label}
                      </option>
                    ))}
                </Form.Select>
              )}
              <Form.Control.Feedback type="invalid">
                {errors.sem}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Subject
                <br />
              </Form.Label>
              {values.sem && (
                <Form.Select
                  name="subject"
                  value={values.subject}
                  onChange={handleChange}
                  isValid={touched.subject && !errors.subject}
                  isInvalid={!!errors.subject}
                >
                  <option value=""> Select Subject</option>
                  {course
                    .find((course) => course.value === values.course)
                    .sems.find((sem) => sem.value === values.sem)
                    .subject.map((sub, i) => (
                      <option key={i} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                </Form.Select>
              )}
              <Form.Control.Feedback type="invalid">
                {errors.subject}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" style={{ width: `100%` }}>
              Upload
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default GoogleDriveUploader;
