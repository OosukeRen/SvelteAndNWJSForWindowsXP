# **Context Menu Utility for NW.js & Svelte**

This utility provides a **global `menu()` function** for creating dynamic context menus in **NW.js & Svelte** applications. It is already included in `App.svelte` in the template repository.

---

## **📌 How It Works**

The **`menu()` function** allows developers to dynamically generate a **custom context menu** anywhere in the application. It leverages **Svelte components** to handle menu interactions seamlessly.

### **✅ Features**
- Fully **customizable menu options**
- **Nested submenus** support
- Can be **triggered anywhere**
- **Easy integration** with Svelte components

---

## **🛠 Usage**

### **1️⃣ Creating a Simple Context Menu**

To create a simple **right-click menu**, call the `menu()` function like this:

```js
menu({
    x: event.clientX,
    y: event.clientY,
    options: [
        { label: "Open", click: () => console.log("Open clicked") },
        { label: "Save", click: () => console.log("Save clicked") },
        { separator: true },
        { label: "Exit", click: () => console.log("Exit clicked") }
    ]
});
```

#### **🔹 Explanation:**
- **`x` / `y`** → Defines the menu's position.
- **`options`** → An array of menu items.
    - **`label`** → Text displayed in the menu.
    - **`click`** → Function to execute on selection.
    - **`separator: true`** → Adds a horizontal line between items.

---

### **2️⃣ Nested Submenus**

You can also create **submenus** by adding an `options` array inside a menu item:

```js
menu({
    x: event.clientX,
    y: event.clientY,
    options: [
        {
            label: "File",
            options: [
                { label: "New", click: () => console.log("New file") },
                { label: "Open", click: () => console.log("Open file") },
                { label: "Save", click: () => console.log("Save file") }
            ]
        },
        {
            label: "Edit",
            options: [
                { label: "Cut", click: () => console.log("Cut") },
                { label: "Copy", click: () => console.log("Copy") },
                { label: "Paste", click: () => console.log("Paste") }
            ]
        }
    ]
});
```

#### **🔹 Explanation:**
- Items containing `options` will **show a submenu** when hovered.
- You can nest menus **infinitely**.

---

### **3️⃣ Binding Context Menu to an Element**

To **trigger the menu** when right-clicking an element, add an event listener:

```js
document.getElementById("myElement").addEventListener("contextmenu", (event) => {
    event.preventDefault();
    menu({
        x: event.clientX,
        y: event.clientY,
        options: [
            { label: "Option 1", click: () => console.log("Clicked Option 1") },
            { label: "Option 2", click: () => console.log("Clicked Option 2") }
        ]
    });
});
```

#### **🔹 Explanation:**
- `event.preventDefault();` **prevents the default browser context menu**.
- The menu will appear **only for the specified element**.

---

## **🎨 Custom Styling**

To modify the **menu's appearance**, edit the styles in `Menu.svelte`:

```css
.menu_body {
    background-color: white;
    border: 1px solid gray;
    box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.5);
    padding: 0.25rem;
    position: absolute;
    display: flex;
    flex-direction: column;
}

.single_menu_option {
    padding: 0.3rem 0.7rem;
    width: 15rem;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.single_menu_option:hover {
    background-color: #316ac5;
    color: white;
}
```

---

## **🔗 Summary**

- **`menu({ options })`** opens a custom menu.
- Supports **nested menus** and **clickable options**.
- **Attach to elements** for custom right-click behavior.
- Easily **style with CSS** in `Menu.svelte`.

> 💡 **Use this to replace default browser menus or create custom app menus!**

