import 'package:flutter/material.dart';
import 'package:frontend/pages/utils/buttons.dart';

class DialogBox extends StatelessWidget {
  final controller;
  VoidCallback onSave;
  VoidCallback onCancel;

  DialogBox(
      {super.key,
      required this.controller,
      required this.onSave,
      required this.onCancel});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: const Color.fromARGB(255, 255, 255, 255),
      content: SizedBox(
        height: 120,
        child:
            Column(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
          // user input
          TextField(
            controller: controller,
            decoration: const InputDecoration(hintText: "Add a new task"),
          ),

          // save button and cancle button
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              // cancel button
              MyButtons(btnName: "Cancel", onPressed: onCancel),

              const Spacer(),

              // save button
              MyButtons(btnName: "Save", onPressed: onSave),
            ],
          )
        ]),
      ),
    );
  }
}
