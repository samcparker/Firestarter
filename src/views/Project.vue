<template>
  <div style="width: 100%">
    <v-list>
      <v-list-group v-for="(collection, i) in collections" :key="i">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>{{ i }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-group
          sub-group
          v-for="(doc, doc_id) in collection"
          :key="doc_id"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ doc_id }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="(value, key) in doc" :key="key">
            <v-list-item-content>
              <v-row>
                <v-col cols="2">{{ key }}</v-col>

                <v-col cols="9">
                  <v-text-field
                    @keypress="saveEdit(doc_id, key, collection, i, $event)"
                    v-model="edit_value"
                    v-if="editing_id == doc_id && editing_key == key"
                    :value="value"
                  ></v-text-field>

                  <v-list-item-title v-else>{{ value }}</v-list-item-title>
                </v-col>

                <v-col cols="1">
                  <v-row v-if="editing_id == doc_id && editing_key == key" icon>
                    <v-btn icon>
                      <v-icon v-on:click="saveEdit(doc_id, key, collection, i)"
                        >mdi-check</v-icon
                      >
                    </v-btn>
                    <v-btn icon>
                      <v-icon v-on:click="cancelEdit">mdi-close</v-icon>
                    </v-btn>
                  </v-row>

                  <v-btn v-else v-on:click="editItem(doc_id, key, value)" icon
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
      // TODO : Convert back to object in future
      if (typeof value == "object") {
        this.edit_value = JSON.stringify(value);
      } else {
        this.edit_value = value;
      }

      this.editing_id = id;
      this.editing_key = key;
    },
    cancelEdit() {
      this.editing_id = null;
      this.editing_key = null;
      this.edit_value = null;
    },
    saveEdit(id, key, collection, collection_name, event) {
      console.log(key);
      let editVal = this.edit_value;
      if (event == null || event.key == "Enter") {
        collection[id][key] = this.edit_value;
        this.cancelEdit();
        console.log(collection_name);
        var out = {};
        out[key] = editVal;
        db.collection(collection_name)
          .doc(id)
          .set(out, { merge: true })
          .then(() =>
            console.log(
              `Document successfully written!\nWritten ${editVal} to ${key}!`
            )
          )
          .catch(function(error) {
            console.log("Error writing document: ", error);
          });
      }
      // else absorb
    },
    async getCollections() {
      var vue = this;
      db.collection("projects").onSnapshot(function(querySnapshot) {
        let collections = {};
        collections["projects"] = {};

        querySnapshot.forEach(function(doc) {
          let data = doc.data();
          collections["projects"][doc.id] = data;
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
