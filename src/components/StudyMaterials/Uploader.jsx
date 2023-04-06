import React, { useEffect, useState } from "react";
import { Button, Form, Alert, ProgressBar } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { course } from "./subjects-list";

function GoogleDriveUploader({ socket }) {
  const [progress, setProgress] = useState(0);
  const [showFileAlert, setShowFileAlert] = useState("true");
  const [showProgressAlert, setShowProgressAlert] = useState("true");
  const [progressCompleted, setProgressCompleted] = useState("false");
  const handleProgressReset = () => {
    setProgress(0);
    setProgressCompleted(false);
  };
  const [lockFileInput, setLockFileInput] = useState("false");

  const fileSchema = yup.object().shape({
    file: yup.mixed().required("File is required"),
    course: yup.string().required(),
    sem: yup.string().required(),
    subject: yup.string().required(),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLockFileInput(true);
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

  useEffect(() => {
    socket.on("progress", (progress) => {
      setProgress(progress);
    });
    console.log(progressCompleted);
    console.log(progress);

    if (progress === 100) {
      setShowProgressAlert(false);
      setProgressCompleted(true);
      setLockFileInput(false);
    } else {
      setShowProgressAlert(true);
      setProgressCompleted(false);
    }
    console.log(lockFileInput);
  });
  return (
    <>
      {progress ? (
        <div>
          <ProgressBar striped animated now={progress} label={`${progress}%`} />
          <Alert
            variant="warning"
            show={showProgressAlert}
            onClose={() => setShowProgressAlert(false)}
            dismissible
          >
            Your file is being uploaded...
          </Alert>
          <Alert
            variant="success"
            show={progressCompleted}
            onClose={handleProgressReset}
            dismissible
          >
            File upload Done !
          </Alert>
        </div>
      ) : null}

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
                  size="sm"
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

            <Button
              type="submit"
              variant="outline-primary"
              style={{ width: `100%` }}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default GoogleDriveUploader;
