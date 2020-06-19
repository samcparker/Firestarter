<template>
  <div style="width: 100%">
    <v-list>
      <v-list-group v-for="(collection, i) in collections" :key="i">
        <template v-slot:activator>
          <v-list-item-action>
            <v-btn
              @click.stop="
                dialog = true;
                getRecommendedFields(collection);
              "
              icon
            >
              <v-icon color="grey lighten-1">mdi-plus</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-dialog v-model="dialog" max-width="700">
            <v-card>
              <v-card-title class="headline">{{ i }}</v-card-title>

              <v-card-subtitle>Add new record</v-card-subtitle>
              <div v-if="recommendedFields.length > 0">
                <v-card-text
                  >Here are some fields found in other records:</v-card-text
                >

                <v-chip-group>
                  <v-chip
                    @click.stop="addField(chip)"
                    v-for="chip in recommendedFields"
                    :key="chip"
                  >
                    {{ chip }}
                    <v-icon small right>mdi-plus</v-icon>
                  </v-chip>
                </v-chip-group>
              </div>
              <v-row class="width: 100%">
                <v-text-field
                  class="px-5"
                  v-model="newRecordName"
                  label="Record Name"
                ></v-text-field
                ><v-btn icon @click.stop="randomiseName"
                  ><v-icon>mdi-dice-multiple-outline</v-icon></v-btn
                >
              </v-row>

              <v-list>
                <v-list-item v-for="(newValue, newKey) in fields" :key="newKey">
                  <v-text-field :value="newKey" label="Key" class="px-2">{{
                    newKey
                  }}</v-text-field>
                  <v-text-field
                    label="Value"
                    class="px-2"
                    v-model="fields[newKey]"
                  ></v-text-field>
                  <v-btn icon @click="fields[newKey] = nil"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </v-list-item>
                <v-list-item>
                  <v-text-field
                    value=""
                    label="Key"
                    class="px-2"
                  ></v-text-field>
                  <v-text-field label="Value" class="px-2"></v-text-field>
                  <v-btn icon disabled><v-icon>mdi-delete</v-icon></v-btn>
                </v-list-item>
              </v-list>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="green darken-1"
                  text
                  @click="
                    dialog = false;
                    printTable(fields);
                  "
                >
                  Close
                </v-btn>

                <v-btn
                  color="green darken-1"
                  text
                  @click="addRecord(i, fields, newRecordName)"
                >
                  Add Record
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-list-item-content>
            <v-list-item-title
              >{{ i }}
              <span class="font-italic"
                >({{ Object.keys(collection).length }})</span
              ></v-list-item-title
            >
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
            <v-list-item-action>
              <v-row>
                <v-col>
                  <v-btn @click.stop="" icon>
                    <v-icon color="grey lighten-1">mdi-plus</v-icon>
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn @click.stop="deleteDoc(doc_id, collection, i)" icon>
                    <v-icon color="grey lighten-1">mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-action>
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
                      <v-icon @click="saveEdit(doc_id, key, collection, i)"
                        >mdi-check</v-icon
                      >
                    </v-btn>
                    <v-btn icon>
                      <v-icon v-on:click="cancelEdit">mdi-close</v-icon>
                    </v-btn>
                  </v-row>
                  <v-row v-else>
                    <v-btn v-on:click="editItem(doc_id, key, value)" icon
                      ><v-icon>mdi-pencil-outline</v-icon></v-btn
                    >
                  </v-row>
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
      dialog: false,
      collectionNames: ["projects"],
      collections: {},
      editing_id: null,
      editing_key: null,
      edit_value: null,
      fields: {},
      recommendedFields: [],
      newRecordName: ""
    };
  },
  methods: {
    randomiseName() {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 16; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      this.newRecordName = result;
    },
    addRecord(collection_name, record, name) {
      if (name.length < 1) {
        return;
      }
      this.dialog = false;
      db.collection(collection_name)
        .doc(name)
        .set(record, { merge: true })
        .then(() => console.log("Coool shoudl work"))
        .catch(function(error) {
          console.log("Error writing document: ", error);
        });
      this.newRecordName = "";
    },
    addField(chip) {
      this.fields[chip] = "";
      this.removeFromArray(chip, this.recommendedFields);
    },
    printTable(t) {
      console.log(t);
    },
    removeFromArray(element, array) {
      for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === element) {
          array.splice(i, 1);
        }
      }
    },
    getRecommendedFields(collection) {
      this.fields = {};
      var recos = [];
      for (var key in collection) {
        for (var key2 in collection[key]) {
          if (!recos.includes(key2)) {
            recos.push(key2);
          }
        }
      }
      this.recommendedFields = recos;
    },
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
    deleteDoc(id, collection, collection_name) {
      db.collection(collection_name)
        .doc(id)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },
    saveEdit(id, key, collection, collection_name, event) {
      let editVal = this.edit_value;
      if (event == null || event.key == "Enter") {
        var out = {};
        out[key] = editVal;

        db.collection(collection_name)
          .doc(id)
          .set(out, { merge: true })
          .then(() => {
            console.log(
              `Document successfully written!\nWritten ${editVal} to ${key}!`
            );
            this.cancelEdit();
          })
          .catch(function(error) {
            console.log("Error writing document: ", error);
          });
      }
      this.cancelEdit();
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
