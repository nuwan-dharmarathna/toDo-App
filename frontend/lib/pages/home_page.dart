import 'package:flutter/material.dart';
import 'package:frontend/pages/utils/dialog_box.dart';
import 'package:frontend/pages/utils/todo_tile.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // text controler
  final _controller = TextEditingController();

  // List of todo tasks
  List toDoList = [
    ["Test task 1", false],
    ["Test task 2", true],
    ["Make Tutorial", false],
    ["Do Exersices", true]
  ];

  // checkbox tapped
  void checkBoxChanged(bool? value, int index) {
    setState(() {
      toDoList[index][1] = !toDoList[index][1];
      _controller.clear();
    });
  }

  // save new task
  void saveNewTask() {
    setState(() {
      toDoList.add([_controller.text, false]);
    });
    Navigator.of(context).pop();
  }

  // create a new task
  void createNewTask() {
    showDialog(
        context: context,
        builder: (context) {
          return DialogBox(
            controller: _controller,
            onSave: saveNewTask,
            onCancel: () => Navigator.of(context).pop(),
          );
        });
  }

  // delete task
  void deleteTask(int index) {
    setState(() {
      toDoList.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(249, 107, 106, 106),
      appBar: AppBar(
        title: const Text("To Do"),
        elevation: 0,
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color.fromARGB(255, 53, 48, 48),
        onPressed: createNewTask,
        child: const Icon(
          Icons.add,
          color: Color.fromARGB(255, 214, 198, 198),
        ),
      ),
      body: ListView.builder(
        itemCount: toDoList.length,
        itemBuilder: (context, index) {
          return ToDoTile(
            taskName: toDoList[index][0],
            isCompleted: toDoList[index][1],
            onChanged: (value) => checkBoxChanged(value, index),
            deleteFunction: (context) => deleteTask(index),
          );
        },
      ),
    );
  }
}
