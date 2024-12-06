import 'dart:io';

import 'package:evaluateai/providers/classes.dart';
import 'package:evaluateai/providers/evaluators.dart';
import 'package:evaluateai/screens/image_view.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

class NewEvaluatorScreen extends StatefulWidget {
  const NewEvaluatorScreen({super.key});

  @override
  State<NewEvaluatorScreen> createState() => _NewEvaluatorScreenState();
}

class _NewEvaluatorScreenState extends State<NewEvaluatorScreen> {
  final TextEditingController _titleController = TextEditingController();
  String _selectedClass = "";
  List<String> questionPapers = [];
  List<String> answerKeys = [];
  bool _uploadingQuestionPaper = false;
  bool _uploadingAnswerKey = false;

  @override
  Widget build(BuildContext context) {
    var classProvider = Provider.of<ClassesProvider>(context, listen: true);
    var provider = Provider.of<EvaluatorsProvider>(context, listen: true);

    return Scaffold(
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
                  Icon(FeatherIcons.plusCircle),
                  const SizedBox(width: 10),
                  Text(
                    "New Evaluator",
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Expanded(
                child: ListView(
                  children: [
                    Row(
                      children: [
                        Icon(FeatherIcons.type),
                        const SizedBox(width: 10),
                        Text(
                          'Title',
                          style: const TextStyle(
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _titleController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Name of exam / evaluator',
                        filled: true,
                      ),
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Icon(FeatherIcons.users),
                        const SizedBox(width: 10),
                        Text(
                          'Class',
                          style: const TextStyle(
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    DropdownButtonFormField(
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        filled: true,
                      ),
                      items: classProvider.classes.map((e) {
                        print(e);
                        return DropdownMenuItem(
                          child: Text(e['subject'] +
                              " | " +
                              e['name'] +
                              " " +
                              e['section']),
                          value: e['_id'],
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedClass = value.toString();
                        });
                      },
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Icon(FeatherIcons.fileText),
                        const SizedBox(width: 10),
                        Text(
                          'Upload question paper(s)',
                          style: const TextStyle(
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      direction: Axis.horizontal,
                      children: getImageWidgets(questionPapers),
                    ),
                    const SizedBox(height: 10),
                    _uploadingQuestionPaper
                        ? const Center(child: CircularProgressIndicator())
                        : Padding(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            child: Row(
                              children: [
                                TextButton.icon(
                                  onPressed: () async {
                                    final ImagePicker _picker = ImagePicker();
                                    XFile? files = await _picker.pickImage(
                                        source: ImageSource.camera);

                                    File file = File(files!.path);
                                    setState(() {
                                      _uploadingQuestionPaper = true;
                                    });
                                    String url =
                                        await provider.uploadImage(file);
                                    Future.delayed(Duration(seconds: 2), () {
                                      setState(() {
                                        questionPapers.add(url);
                                        _uploadingQuestionPaper = false;
                                      });
                                    });
                                  },
                                  icon: const Icon(FeatherIcons.camera),
                                  label: const Text('Camera'),
                                  style: TextButton.styleFrom(
                                    foregroundColor: Colors.white,
                                    backgroundColor: primaryColor,
                                  ),
                                ),
                                const SizedBox(width: 10),
                                TextButton.icon(
                                  onPressed: () async {
                                    final ImagePicker _picker = ImagePicker();
                                    XFile? files = await _picker.pickImage(
                                        source: ImageSource.gallery);

                                    File file = File(files!.path);
                                    setState(() {
                                      _uploadingQuestionPaper = true;
                                    });
                                    String url =
                                        await provider.uploadImage(file);
                                    Future.delayed(Duration(seconds: 2), () {
                                      setState(() {
                                        questionPapers.add(url);
                                        _uploadingQuestionPaper = false;
                                      });
                                    });
                                  },
                                  icon: const Icon(FeatherIcons.image),
                                  label: const Text('Gallery'),
                                  style: TextButton.styleFrom(
                                    foregroundColor: Colors.white,
                                    backgroundColor: primaryColor,
                                  ),
                                ),
                              ],
                            ),
                          ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Icon(FeatherIcons.key),
                        const SizedBox(width: 10),
                        Text(
                          'Upload answer key / criteria',
                          style: const TextStyle(
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      direction: Axis.horizontal,
                      children: getImageWidgets(answerKeys),
                    ),
                    const SizedBox(height: 10),
                    _uploadingAnswerKey
                        ? const Center(child: CircularProgressIndicator())
                        : Padding(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            child: Row(
                              children: [
                                TextButton.icon(
                                  onPressed: () async {
                                    final ImagePicker _picker = ImagePicker();
                                    XFile? files = await _picker.pickImage(
                                        source: ImageSource.camera);

                                    File file = File(files!.path);
                                    setState(() {
                                      _uploadingAnswerKey = true;
                                    });
                                    String url =
                                        await provider.uploadImage(file);
                                    Future.delayed(Duration(seconds: 2), () {
                                      setState(() {
                                        answerKeys.add(url);
                                        _uploadingAnswerKey = false;
                                      });
                                    });
                                  },
                                  icon: const Icon(FeatherIcons.camera),
                                  label: const Text('Camera'),
                                  style: TextButton.styleFrom(
                                    foregroundColor: Colors.white,
                                    backgroundColor: primaryColor,
                                  ),
                                ),
                                const SizedBox(width: 10),
                                TextButton.icon(
                                  onPressed: () async {
                                    final ImagePicker _picker = ImagePicker();
                                    XFile? files = await _picker.pickImage(
                                        source: ImageSource.gallery);

                                    File file = File(files!.path);
                                    setState(() {
                                      _uploadingAnswerKey = true;
                                    });
                                    String url =
                                        await provider.uploadImage(file);
                                    Future.delayed(Duration(seconds: 2), () {
                                      setState(() {
                                        answerKeys.add(url);
                                        _uploadingAnswerKey = false;
                                      });
                                    });
                                  },
                                  icon: const Icon(FeatherIcons.image),
                                  label: const Text('Gallery'),
                                  style: TextButton.styleFrom(
                                    foregroundColor: Colors.white,
                                    backgroundColor: primaryColor,
                                  ),
                                ),
                              ],
                            ),
                          ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () async {
                        if (provider.creatingEvaluator) {
                          return;
                        }

                        if (_selectedClass.isEmpty ||
                            _titleController.text.isEmpty ||
                            questionPapers.isEmpty ||
                            answerKeys.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                            content: Text("Please fill all the fields"),
                            backgroundColor: Colors.red,
                          ));
                          return;
                        }

                        provider.createEvaluator(_selectedClass,
                            _titleController.text, questionPapers, answerKeys);
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.all(15),
                        backgroundColor: primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: provider.creatingEvaluator
                          ? SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                valueColor:
                                    AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : Text(
                              'Create Evaluator',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> getImageWidgets(List list) {
    List<Widget> widgets = [];

    for (var image in list) {
      widgets.add(
        GestureDetector(
          onTap: () {
            Get.to(() => ImageView(imageUrl: image));
          },
          child: Padding(
            padding: EdgeInsets.only(right: 10, bottom: 10),
            child: Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.network(
                      image,
                      width: 150,
                      height: 150,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Positioned(
                  right: 5,
                  top: 5,
                  child: GestureDetector(
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (context) {
                          return AlertDialog(
                            title: const Text('Delete Answer Sheet'),
                            content: const Text(
                                'Are you sure you want to delete this answer sheet?'),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                },
                                child: const Text('Cancel'),
                              ),
                              TextButton(
                                onPressed: () {
                                  setState(() {
                                    list.remove(image);
                                  });
                                  Navigator.pop(context);
                                },
                                child: const Text('Delete'),
                              ),
                            ],
                          );
                        },
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.all(5),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        FeatherIcons.x,
                        size: 15,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return widgets;
  }
}
