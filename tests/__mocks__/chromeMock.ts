/* 
TabMerger as the name implies merges your tabs into one location to save
memory usage and increase your productivity.

Copyright (C) 2021  Lior Bragilevsky

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

If you have any questions, comments, or concerns you can contact the
TabMerger team at <https://lbragile.github.io/TabMerger-Extension/contact/>
*/

global.chrome = {
  alarms: {
    get: () => {},
    clear: () => {},
    create: () => {},
    onAlarm: { addListener: () => {}, removeListener: () => {} },
  },
  browserAction: {
    onClicked: { addListener: () => {} },
    setBadgeText: (_, cb) => cb(),
    setBadgeBackgroundColor: (_, cb) => cb(),
    setTitle: (_, cb) => cb(),
  },
  commands: {
    onCommand: { addListener: () => {} },
  },
  contextMenus: {
    create: () => {},
    onClicked: { addListener: () => {} },
  },
  downloads: {
    download: (_, cb) => cb(2),
    removeFile: (_, cb) => cb(),
    setShelfEnabled: () => {},
  },
  i18n: {
    getMessage: (msg) => {
      if (msg === "Title") {
        return "титул";
      } else {
        throw new Error("Translation for input does not exist");
      }
    },
  },
  runtime: {
    id: "ldhahppapilmnhocniaifnlieiofgnii",
    getManifest: () => ({
      version: "2.0.0",
      permissions: ["tabs", "contextMenus", "storage", "alarms", "downloads", "downloads.shelf"],
    }),
    setUninstallURL: () => {},
    sendMessage: () => {},
    onMessage: { addListener: () => {} },
  },
  storage: {
    local: {
      get: (keys, cb) => {
        var item;
        if (keys) {
          var local = {};
          // create array if not already
          keys = Array.isArray(keys) ? keys : [keys];
          keys.forEach((key) => {
            // can be a simple string or a stringify
            try {
              local[key] = JSON.parse(localStorage.getItem(key));
            } catch (err) {
              local[key] = localStorage.getItem(key);
            }
          });
          cb(local);
        } else {
          item = { ...localStorage };
          Object.keys(item).forEach((key) => {
            item[key] = JSON.parse(item[key]);
          });
          cb(item);
        }
      },
      remove: (keys, cb) => {
        if (Array.isArray(keys)) {
          keys.forEach((key) => {
            localStorage.removeItem(key);
          });
        } else {
          localStorage.removeItem(keys);
        }

        cb();
      },
      set: (obj, cb) => {
        const key = Object.keys(obj)[0];
        localStorage.setItem(key, JSON.stringify(obj[key]));
        cb();
      },
    },
    sync: {
      get: (key, cb) => {
        var item;
        if (key) {
          item = JSON.parse(sessionStorage.getItem(key));
          cb({ [key]: item });
        } else {
          item = { ...sessionStorage };
          Object.keys(item).forEach((key) => {
            item[key] = JSON.parse(item[key]);
          });
          cb(item);
        }
      },
      remove: (keys, cb) => {
        if (Array.isArray(keys)) {
          keys.forEach((key) => {
            sessionStorage.removeItem(key);
          });
        } else {
          sessionStorage.removeItem(keys);
        }

        cb();
      },
      set: (obj, cb) => {
        const key = Object.keys(obj)[0];
        sessionStorage.setItem(key, JSON.stringify(obj[key]));
        cb();
      },
    },
    onChanged: { addListener: () => {}, removeListener: () => {} },
  },
  tabs: {
    create: (obj, cb) => {
      var open_tabs = JSON.parse(sessionStorage.getItem("open_tabs"));
      open_tabs.push(obj);
      sessionStorage.setItem("open_tabs", JSON.stringify(open_tabs));

      cb();
    },
    move: (id, _) => {
      var open_tabs = JSON.parse(sessionStorage.getItem("open_tabs"));

      var tab_to_move = open_tabs.filter((x) => x.id === id);
      var index = open_tabs.indexOf(tab_to_move[0]);
      open_tabs.push(open_tabs.splice(index, 1)[0]); // move it to the end

      sessionStorage.setItem("open_tabs", JSON.stringify(open_tabs));
    },
    query: (opts, cb) => {
      var open_tabs =
        opts.active || opts.title === "TabMerger"
          ? [{ title: "TabMerger", url: "https://github.com/lbragile/TabMerger", id: 99 }]
          : JSON.parse(sessionStorage.getItem("open_tabs"));
      cb(open_tabs);
    },
    remove: (ids) => {
      ids = Array.isArray(ids) ? ids : [ids];
      var open_tabs = JSON.parse(sessionStorage.getItem("open_tabs"));
      var remain_open_tabs = open_tabs.filter((x) => !ids.includes(x.id));
      sessionStorage.setItem("open_tabs", JSON.stringify(remain_open_tabs));
    },
    update: (_, __, cb) => cb(),
    onUpdated: { addListener: (cb) => cb(), removeListener: (cb) => cb() },
  },
};