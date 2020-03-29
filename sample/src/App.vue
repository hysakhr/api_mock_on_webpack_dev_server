<template>
  <v-app id="inspire">
    <!-- app bar -->
    <v-app-bar app color="indigo" dark flat>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <!-- content -->
    <v-content>
      <!-- call GET method -->
      <v-toolbar flat>
        <v-btn @click="sendApi">/api</v-btn>
      </v-toolbar>

      <!-- call POST method for file upload -->
      <v-toolbar flat>
        <v-btn @click="sendCSV">/api/csv_upload</v-btn>
        <v-file-input
          @change="changeFile"
          @click:clear="clearFile"
          label="csv file input.  First row is treated header.  Send by left button."
        ></v-file-input>
      </v-toolbar>

      <v-toolbar flat>
        <v-file-input
          @change="sendCSVForFileChange"
          label="csv file input.  First row is treated header.  Send when file changed."
        ></v-file-input>
      </v-toolbar>

      <v-card flat>
        <v-card-title>Response</v-card-title>
        <v-container v-if="isTable">
          <v-data-table :headers="tableHeaders" :items="tableItems"></v-data-table>
        </v-container>

        <v-container v-if="!isTable">
          <pre>{{ response }}</pre>
        </v-container>
      </v-card>
    </v-content>

    <!-- footer -->
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    isTable: false,
    tableHeaders: [],
    tableItems: [],
    response: null,
    file: null
  }),
  methods: {
    sendApi: async function() {
      const response = await axios.get("/api");
      this.response = response.data;
      this.isTable = false;
    },
    changeFile: function(file) {
      this.file = file;
    },
    clearFile: function() {
      this.file = null;
    },
    sendCSV: async function() {
      if (!this.file) {
        alert("select csv file");
        return;
      }

      // clear table info
      this.tableHeaders = [];
      this.tableItems = [];

      const response = await this.sendFile(this.file);
      this.setTableData(response.data);
    },
    sendCSVForFileChange: async function(file) {
      console.log("sendCSVForFileChange");
      console.log(file);
      // when claer button
      if (!file) {
        return;
      }
      // clear table info
      this.tableHeaders = [];
      this.tableItems = [];

      const response = await this.sendFile(file);
      this.setTableData(response.data);
    },
    sendFile: async function(file) {
      // send file
      const formData = new FormData();
      formData.append("file", file);
      const params = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      const response = await axios.post("/api/csv_upload", formData, params);
      return response;
    },
    setTableData(data) {
      // create header
      const header = data[0];

      for (let i = 0; i < header.length; i++) {
        this.tableHeaders.push({
          text: header[i],
          value: "index_" + i
        });
      }

      // create items
      for (let i = 1; i < data.length; i++) {
        const rowData = data[i];
        const item = {};
        for (let j = 0; j < this.tableHeaders.length; j++) {
          const headerInfo = this.tableHeaders[j];
          item[headerInfo.value] = rowData[j];
        }
        this.tableItems.push(item);
      }

      this.isTable = true;
    }
  }
};
</script>