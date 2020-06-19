<template>
  <div style="width: 100%">
    <v-list>
      <v-list-group v-for="(collection, i) in collections" :key="i">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>{{ i }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-group sub-group v-for="(data, j) in collection" :key="j">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ j }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="(value, key) in data" :key="key">
            <v-list-item-content>
              <v-row>
                <v-col cols="2">{{ key }}</v-col>

                <v-col cols="9">
                  <v-text-field
                    @keypress="saveEdit(j, key, collection, $event)"
                    v-model="edit_value"
                    v-if="editing_id == j && editing_key == key"
                    :value="value"
                  ></v-text-field>

                  <v-list-item-title v-else>{{ value }}</v-list-item-title>
                </v-col>

                <v-col cols="1">
                  <v-row v-if="editing_id == j && editing_key == key" icon>
                    <v-btn icon>
                      <v-icon v-on:click="saveEdit(j, key, collection)"
                        >mdi-check</v-icon
                      >
                    </v-btn>
                    <v-btn icon>
                      <v-icon v-on:click="cancelEdit">mdi-close</v-icon>
                    </v-btn>
                  </v-row>

                  <v-btn v-else v-on:click="editItem(j, key, value)" icon
                    ><v-icon>mdi-pencil-outline</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
import { db } from "@/main";

export default {
  data: () => {
    return {
      collectionNames: ["projects"],
      collections: {},
      editing_id: null,
      editing_key: null,
      edit_value: null
    };
  },
  methods: {
    editItem(id, key, value) {
      this.edit_value = value;
      this.editing_id = id;
      this.editing_key = key;
      
    },
    cancelEdit() {
      this.editing_id = null;
      this.editing_key = null;
      this.edit_value = null;
    },
    saveEdit(id, key, collection, event) {
      console.log(id);
      console.log(key);
      console.log(this.edit_value);
      if (event == null || event.key == "Enter") {
        collection[id][key] = this.edit_value;
        this.cancelEdit();
      }
      // else absorb
    },
    async getCollections() {
      // db.collection("projects")
      //   .get()
      //   .then(function(querySnapshot) {
      //     querySnapshot.forEach(function(doc) {
      //       let data = doc.data();
      //       let item = {};
      //       item[doc.id] = data;
      //       collections["projects"].push(item);
      //     });
      //   });
      var vue = this;
      db.collection("projects").onSnapshot(function(querySnapshot) {
        // console.log("onsnap")
        // collections = {};
        // collections["projects"] = [];
        let collections = {};
        collections["projects"] = {};

        querySnapshot.forEach(function(doc) {
          let data = doc.data();
          collections["projects"][doc.id] = data;
          // let data = doc.data();
          // let item = {};
          // item[doc.id] = data;
          // collections["projects"].push(item);
        });
        vue.collections = collections;
        console.log(vue.collections);
      });
    }
  },
  mounted() {
    this.getCollections();
  }
};
</script>

<style>
.list-item {
  transition: 0.3s;
}
.list-item:hover {
  background-color: rgb(37, 37, 37);
}
</style>
