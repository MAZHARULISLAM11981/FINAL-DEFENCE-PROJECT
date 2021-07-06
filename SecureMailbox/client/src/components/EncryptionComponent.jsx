import React, { useState } from "react";
import { Button, Container, Grid, TextField } from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { makeStyles } from "@material-ui/core/styles";
import Notification from "./Notification";
import FileSaver from "file-saver";
import { encrypt, fileToData, checkCrypt } from "../utils/handleFiles";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  fileButton: {
    marginRight: "1em",
  },
}));

function EncryptionComponent() {
  const [encryptionKey, setEncryptionKey] = useState("");
  const [file, setFile] = useState({ filePath: "", fileName: "" });
  const { filePath, fileName } = file;
  const classes = useStyles();

  const handleValidation = () => {
    if (fileName === "" || encryptionKey === "") {
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
        Notification("Warning", "Provide valid file for encryption", "warning");
      } else {
        const FileToData = await fileToData(filePath);
        const encryptedData = await encrypt(FileToData, filePath.name, encryptionKey, "hints");
        FileSaver.saveAs(encryptedData.file, encryptedData.name);
        Notification("Success", "Your file is encrypted successfully", "success");
        setEncryptionKey("");
        setFile({ fileName: "" });
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
              <TextField label="Enter encryption key" type="text" value={encryptionKey} variant="outlined" fullWidth onChange={(e) => setEncryptionKey(e.target.value)} />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Encrypt file
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default EncryptionComponent;
