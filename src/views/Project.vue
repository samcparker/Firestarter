<template>
  <div style="width: 100%">
    <div v-for="(collection, i) in collections" :key="i" style="width: 100%">
      {{ i }}
      <div v-for="(item, j) in collection" :key="j" style="width: 100%">
        <div v-for="(value, k) in item" :key="k" style="width: 100%">
          <v-list>
            <v-list-group>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ k }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item v-for="(subItem, l) in value" :key="l">
                <v-list-item-content>
                  <v-row>
                    <v-col cols="2">
                      {{ l }}
                    </v-col>
                    <v-col cols="9">
                      <v-text-field
                        v-model="edit_value"
                        v-if="editing_id == k && editing_key == l"
                        :value="subItem"
                      ></v-text-field>
                      <v-list-item-title v-else>{{
                        subItem
                      }}</v-list-item-title>
                    </v-col>
                    <v-col cols="1">
                      <v-row v-if="editing_id == k && editing_key == l" icon>
                        <v-btn icon>
                          <v-icon v-on:click="saveEdit(k, l, item)">mdi-check</v-icon>
                        </v-btn>
                        <v-btn icon>
                          <v-icon v-on:click="cancelEdit">mdi-close</v-icon>
                        </v-btn>
                      </v-row>

                      <v-btn v-else v-on:click="editItem(k, l, subItem)" icon
                        ><v-icon>mdi-pencil-outline</v-icon></v-btn
                      >
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </div>
      </div>
    </div>
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
      this.editing_id = id;
      this.editing_key = key;
      this.edit_value = value;
    },
    cancelEdit() {
      this.editing_id = null;
      this.editing_key = null;
      this.edit_value = null;
    },
    saveEdit(id, key, collection) {
      console.log(id)
      console.log(collection)
      console.log(collection[id])
      collection[id][key] = this.edit_value;
      this.cancelEdit();
    },
    async getCollections() {
      this.collections["projects"] = [];
      //   db.collection("projects").get().then(function(querySnapshot) {
      //       querySnapshot.forEach(function(doc) {
      //         this.all["projects"].push(doc.data());
      //       })
      //     );
      let collections = {};
      collections["projects"] = [];
      db.collection("projects")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            let data = doc.data();
            let item = {};
            item[doc.id] = data;
            collections["projects"].push(item);
          });
        });
      this.collections = collections;
      console.log(collections);
    }
  },
  mounted() {
    this.getCollections();
  }
};
</script>

<style></style>
