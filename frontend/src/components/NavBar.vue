<template>
  <div class="navbar">
    <Menubar :model="items">
      <template #start>
        <img src="@/assets/icon.png" alt="Icon" width="35" height="40" class="h-8 m-2"/>
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="flex items-center" v-bind="props.action" >
          <span>{{ item.label }}</span>
          <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
          <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
          <i v-if="hasSubmenu" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
        </a>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" />
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script>
import Menubar from 'primevue/menubar';

export default {
  components:{
    Menubar
  },
  data() {
    return {
      items: [
        {
          label: 'Inicio',
          icon: 'pi pi-home'
        },
        {
          label: 'Jogos',
          icon: 'pi pi-search',
          badge: 3,
          items: [
            {
              label: 'Jogo da memoria',
              icon: 'pi pi-bolt',
              shortcut: '⌘+S'
            },
            {
              label: 'Palavra Cruzada',
              icon: 'pi pi-server',
              shortcut: '⌘+B'
            },
            {
              separator: true
            },
            {
              label: 'Sudoku',
              icon: 'pi pi-pencil',
              shortcut: '⌘+U'
            }
          ]
        },
        {
          label: 'Configurações',
          icon: 'pi pi-spin pi-cog'
        },
      ]
    };
  }
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

body {
  margin-top: 60px;
}
</style>
