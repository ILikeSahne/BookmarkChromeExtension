bookmarks = readBookmarks();
updateHtml();

$("#save_input").click(function() {
    let val = $("#input_bookmark").val();
    addBookmark(val);
});

$("#save_tab").click(function() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        addBookmark(tabs[0].url);
    });
});

$("#delete_all").click(function() {
    bookmarks = [];
    updateHtml();
});

function addBookmark(val) {
    if(!val)
        return;
    if(bookmarks.includes(val)) {
        error("Booksmark already in list!")
        return;
    }
    bookmarks.push(val);
    updateHtml();
}

function updateHtml() {
    let bookmarksList = $("#bookmarks");
    bookmarksList.html("");
    for(let val of bookmarks) {
        let bookmark = $(document.createElement("li"));

        let deleteIcon = $(document.createElement("p"));
        deleteIcon.text("🗑️");
        deleteIcon.click(function(e) {
            let li = $(e.target).parent();
            let value = li.find("a").text();
            var index = bookmarks.indexOf(value);
            if (index !== -1)
                bookmarks.splice(index, 1);
            updateHtml();
        });
        
        let a = $(document.createElement("a"));
        a.attr("href", val);
        a.text(val);
        a.click(function() {
            chrome.tabs.create({ url: val });
        });

        bookmark.append(deleteIcon);
        bookmark.append(a);

        bookmarksList.append(bookmark);
    }
    storeBookmarks();
}

function storeBookmarks() {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function readBookmarks() {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    if(!bookmarks)
        return [];
    return bookmarks;
}

function error(text) {
    console.log('%c' + text, 'color: red');
}