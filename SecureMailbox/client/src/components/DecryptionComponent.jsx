import React, { useState } from "react";
import { Button, Container, Grid, TextField } from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { makeStyles } from "@material-ui/core/styles";
import Notification from "./Notification";
import FileSaver from "file-saver";
import { checkCrypt, decrypt } from "../utils/handleFiles";

const useStyles = makeStyles((theme) => ({
  fileInput: {
    padding: "20px",
    border: "none",
    outlined: "none",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  fileButton: {
    marginRight: "1em",
  },
}));

function DecryptionComponent() {
  const [decryptionKey, setDecryptionKey] = useState("");
  const [file, setFile] = useState({ filePath: "", fileName: "" });
  const { filePath, fileName } = file;
  const classes = useStyles();

  const handleValidation = () => {
    if (file.fileName === "" || decryptionKey === "") {
      return false;
    } else {
      return true;
    }
  };
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile({ filePath: selectedFile, fileName: selectedFile.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) {
      Notification("Warning", "All fields are required!", "warning");
    } else {
      const CheckCrypt = await checkCrypt(filePath);
      if (CheckCrypt) {
        const decryptedData = await decrypt(filePath, decryptionKey);
        if (decryptedData.error) {
          Notification("Error", "Invalid secret key", "error");
        } else {
          FileSaver.saveAs(decryptedData.file, decryptedData.name);
          Notification("Success", "Your file is decrypted successfully", "success");
          setDecryptionKey("");
          setFile({ fileName: "" });
        }
      } else {
        Notification("Warning", "Provide encrypted file only!", "warning");
      }
    }
  };
  return (
    <div>
      <Container maxWidth="md">
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button variant="contained" component="label" startIcon={<AttachmentIcon />} className={classes.fileButton}>
                File Input
                <input type="file" hidden name="encryptFile" onChange={handleChange} />
              </Button>
              {fileName}
            </Grid>
            <Grid item xs={12}>
              <TextField label="Enter decryption key" type="text" value={decryptionKey} variant="outlined" fullWidth onChange={(e) => setDecryptionKey(e.target.value)} />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Decrypt file
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default DecryptionComponent;
