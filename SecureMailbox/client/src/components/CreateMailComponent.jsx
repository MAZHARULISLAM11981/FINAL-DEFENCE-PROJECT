import React, { useState, useEffect } from "react";
import { Box, Button, Card, CardContent, CircularProgress, Container, Grid, List, ListItem, ListItemText, TextField, Typography } from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import Notification from "./Notification";
import axios from "axios";

function CreateMailComponent() {
  const [mailInformation, setMailInformation] = useState({
    mailSubject: "",
    message: "",
    mailTo: "",
  });
  const [file, setFile] = useState({ selectedFile: "", filePath: "", fileName: "" });
  const [loading, setLoading] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [userListLoading, setUserListLoading] = useState(false);

  const { selectedFile, filePath, fileName } = file;
  const { mailSubject, message, mailTo } = mailInformation;

  useEffect(() => {
    setUserListLoading(true);
    axios
      .get("/users", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data.data);
        const currentUser = localStorage.getItem("email");
        const filteredUsers = res.data.data.filter((el) => el.role !== "admin" && el.email !== currentUser);
        setRegisteredUsers(filteredUsers);
      })
      .finally(() => setUserListLoading(false));
  }, []);

  const handleChange = (e) => setMailInformation({ ...mailInformation, [e.target.name]: e.target.value });

  const handleValidation = () => {
    const validEmail = /.+@.+\..+/.test(mailTo);
    if (mailTo === "" || mailSubject === "" || message === "" || filePath === "") {
      return Notification("Warning", "All fields are required", "warning");
    } else if (!validEmail) {
      return Notification("Warning", "Email is not valid", "warning");
    } else {
      return true;
    }
  };

  const handleFileChange = (e) => {
    setFile({ selectedFile: e.target.files[0], fileName: e.target.files[0].name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // uploading file to cloudinary server
    if (handleValidation()) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "ml_default");
      const options = {
        method: "POST",
        body: formData,
      };

      const cloudInfo = await fetch("https://api.Cloudinary.com/v1_1/dck5ccwjv/raw/upload", options);
      const cloudResponse = await cloudInfo.json();

      const mailFrom = localStorage.getItem("email");

      axios
        .post(
          "/emails",
          { subject: mailSubject, message: message, filePath: cloudResponse.url, from: mailFrom, to: mailTo },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.status === "ok") {
            Notification("Success", "Mail sent successfully", "success");
            setMailInformation({ mailSubject: "", mailTo: "", message: "" });
            setFile({ fileName: "" });
          } else {
            Notification("Error", `${res.data.message}`, "error");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            {userListLoading ? (
              <CircularProgress />
            ) : registeredUsers.length === 0 ? (
              <Typography variant="h5">No valid email found</Typography>
            ) : (
              <Card variant="outlined" style={{ borderRadius: 10 }}>
                <Box display="flex" justifyContent="center" p={2}>
                  <Typography variant="h6">User Emails</Typography>
                </Box>
                <CardContent style={{ maxHeight: "50vh", overflow: "auto" }}>
                  <List>
                    {registeredUsers.map((el, i) => (
                      <ListItem key={i + 1}>
                        <ListItemText primary={el.email} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} sm={8}>
            <form onSubmit={handleSubmit}>
              <Grid item xs={12} style={{ marginBottom: 20 }}>
                <TextField variant="outlined" label="To" name="mailTo" value={mailTo} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} style={{ marginBottom: 20 }}>
                <TextField variant="outlined" label="Subject" name="mailSubject" value={mailSubject} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} style={{ marginBottom: 20 }}>
                <TextField variant="outlined" label="Message" name="message" value={message} rows={4} multiline onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} style={{ marginBottom: 20 }}>
                <Button variant="contained" component="label" startIcon={<AttachmentIcon />} style={{ marginRight: 1 }}>
                  Select File
                  <input type="file" hidden name="encryptFile" onChange={handleFileChange} />
                </Button>
                {fileName}
              </Grid>

              <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
                {loading ? "Sending" : "Send"}
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default CreateMailComponent;
