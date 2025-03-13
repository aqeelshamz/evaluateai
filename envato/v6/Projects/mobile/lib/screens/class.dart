import 'package:evaluateai/providers/classes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class ClassScreen extends StatefulWidget {
  final Map classData;
  const ClassScreen({super.key, required this.classData});

  @override
  State<ClassScreen> createState() => _ClassScreenState();
}

class _ClassScreenState extends State<ClassScreen> {
  @override
  void initState() {
    Provider.of<ClassesProvider>(context, listen: false)
        .getStudents(widget.classData['_id']);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var provider = Provider.of<ClassesProvider>(context, listen: true);

    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          showDialog(
            context: context,
            builder: (context) {
              final TextEditingController _rollNoController =
                  TextEditingController();
              final TextEditingController _nameController =
                  TextEditingController();

              _rollNoController.text =
                  (provider.students.length + 1).toString();

              return AlertDialog(
                title: const Text("New Student"),
                content: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: _rollNoController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'RollNo',
                        filled: true,
                      ),
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Name',
                        filled: true,
                      ),
                      keyboardType: TextInputType.name,
                    ),
                  ],
                ),
                actions: [
                  TextButton(
                    onPressed: () {
                      Get.back();
                    },
                    child: const Text("Cancel"),
                  ),
                  TextButton(
                    onPressed: () {
                      Provider.of<ClassesProvider>(context, listen: false)
                          .addStudent(
                        widget.classData['_id'],
                        _nameController.text,
                        int.parse(_rollNoController.text),
                      );
                      Get.back();
                    },
                    child: const Text("Save"),
                  ),
                ],
              );
            },
          );
        },
        label: Text("New Student"),
        icon: const Icon(FeatherIcons.plus),
      ),
      body: Container(
        padding: const EdgeInsets.all(20),
        width: Get.width,
        height: Get.height,
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  IconButton(
                    padding: EdgeInsets.zero,
                    icon: const Icon(FeatherIcons.arrowLeft),
                    onPressed: () {
                      Get.back();
                    },
                  ),
                  const SizedBox(width: 10),
                  Icon(FeatherIcons.book, size: 18),
                  const SizedBox(width: 10),
                  Text(
                    widget.classData['subject'],
                    style: const TextStyle(
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(width: 20),
                  Icon(FeatherIcons.users, size: 18),
                  const SizedBox(width: 10),
                  Text(
                    widget.classData['name'],
                    style: const TextStyle(
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(width: 5),
                  Text(
                    widget.classData['section'],
                    style: const TextStyle(
                      fontSize: 18,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(FeatherIcons.users),
                      const SizedBox(width: 10),
                      Text(
                        'Students',
                        style: const TextStyle(
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) {
                          return AlertDialog(
                            title: const Text("Delete Class"),
                            content: const Text(
                                "Are you sure you want to delete this class?"),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  Get.back();
                                },
                                child: const Text("Cancel"),
                              ),
                              TextButton(
                                onPressed: () {
                                  Provider.of<ClassesProvider>(context,
                                          listen: false)
                                      .deleteClass(widget.classData['_id']);
                                  Get.back();
                                },
                                child: const Text(
                                  "Delete Class",
                                  style: TextStyle(
                                    color: Colors.red,
                                  ),
                                ),
                              ),
                            ],
                          );
                        },
                      );
                    },
                    child: const Text(
                      "Delete Class",
                      style: TextStyle(
                        color: Colors.red,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Expanded(
                child: RefreshIndicator(
                  onRefresh: () async {
                    await Provider.of<ClassesProvider>(context, listen: false)
                        .getStudents(widget.classData['_id']);
                  },
                  child: ListView.builder(
                    itemCount: provider.students.length,
                    itemBuilder: (context, index) {
                      //container containing student rollNo, name, edit and delete buttons
                      return Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${provider.students[index]["rollNo"]}. ${provider.students[index]["name"]}',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                IconButton(
                                  icon: const Icon(FeatherIcons.trash),
                                  onPressed: () {
                                    showDialog(
                                      context: context,
                                      builder: (context) {
                                        return AlertDialog(
                                          title: const Text("Delete Student"),
                                          content: const Text(
                                              "Are you sure you want to delete this student?"),
                                          actions: [
                                            TextButton(
                                              onPressed: () {
                                                Get.back();
                                              },
                                              child: const Text("Cancel"),
                                            ),
                                            TextButton(
                                              onPressed: () {
                                                Provider.of<ClassesProvider>(
                                                        context,
                                                        listen: false)
                                                    .deleteStudent(
                                                  widget.classData['_id'],
                                                  provider.students[index]
                                                      ['rollNo'],
                                                );
                                                Get.back();
                                              },
                                              child: const Text("Delete"),
                                            ),
                                          ],
                                        );
                                      },
                                    );
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
