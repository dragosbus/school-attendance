(function () {

  var model = {

    init() {
      if (!localStorage.attendance) {
        localStorage.attendance = JSON.stringify([]);
      }
    },

    add(obj) {
      var data = JSON.parse(localStorage.attendance);
      data.push(obj);
      localStorage.attendance = JSON.stringify(data);
    },

    getStorage() {
      return JSON.parse(localStorage.attendance);
    }

  };

  var controller = {

    random() {
      return (Math.random() >= 0.5);
    },

    addStudent(name) {

      model.add({
        name: name,
        attend: [],
        missed: 0
      });
      this.addAttend();
    },

    addAttend() {
      var data = model.getStorage();
      for (let i = 0; i < data.length; i++) {
        var student = data[i];
        //check the length for attend array for avoiding duplicates
        if (student.attend.length < 1) {
          for (let j = 0; j <= 11; j++) {
            student.attend.push(this.random());
          }

        }
      }
      localStorage.attendance = JSON.stringify(data);
    },
    //increase missedDays for checkboxes with checked value false
    changeDays(student, check) {
      var data = model.getStorage();
      if (!check) {
        data[student].missed++;
      }

      localStorage.attendance = JSON.stringify(data);
    },
    //handler for decrease missedDays when the result checkbox clicked is true 
    decreaseMissed(student) {
      var data = model.getStorage();
      data[student - 1].missed--;
      localStorage.attendance = JSON.stringify(data);
    },

    //update attend array when checkboxes are clicked
    changeCheck(check, index, parent) {
      var data = model.getStorage();
      data[parent - 1].attend[index] = check;

      localStorage.attendance = JSON.stringify(data);
    },

    getData() {
      return JSON.parse(localStorage.attendance);
    },

    init() {
      model.init();
      view.init();
    }
  };

  var view = {
    init() {

      this.students = document.querySelectorAll('tbody .name-col');
      //check if array from localStorage is empty for avoiding duplicates.Without this condition every time the page refresh will push all students to array
      if (controller.getData().length < 1) {
        this.students.forEach((student) => {
          controller.addStudent(student.textContent);
        });

      }
      this.changeCheck();
      this.render();
    },

    render() {
      //Update the DOM
      this.studentsDOM = document.querySelectorAll('.student');

      for (let i = 0; i < this.studentsDOM.length; i++) {
        var studentDOM = this.studentsDOM[i];
        var student = controller.getData()[i];
        var checkDOM = studentDOM.querySelectorAll('.attend-col input');
        var missed = studentDOM.querySelector('.missed-col');

        //Update checkboxes in the DOM
        for (let j = 0; j < student.attend.length; j++) {
          checkDOM[j].checked = student.attend[j];
          if (!student.missed) {
            controller.changeDays(i, student.attend[j]);
          }
        }

      }

      for (let i = 0; i < this.studentsDOM.length; i++) {
        var missed = this.studentsDOM[i].querySelector('.missed-col');
        missed.textContent = controller.getData()[i].missed;
      }

    },

    changeCheck() {
      //event listener for when checkbox is changed and update the values in attend array from localStorage and change the number of days missed
      var checks = document.querySelectorAll('.attend-col input');

      for (let i = 0; i < checks.length; i++) {
        checks[i].addEventListener('change', function () {
          //get the id of student parent for checkbox clicked
          var parent = this.parentNode.parentNode.id;
          //Because we select all checkboxes we should set a class for checkboxes with name 0-11.Like this we separate checkboxes for every student
          var thisClass = parseInt(this.className);
          controller.changeCheck(this.checked, thisClass, parent);
          if (!checks[i].checked) {
            controller.changeDays(parent - 1, this.checked);
          } else {
            controller.decreaseMissed(parent);
            view.render();
          }
          view.render();
        });
      }
    }

  };

  controller.init();

}());