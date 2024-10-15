import 'package:evaluateai/providers/classes.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class NewClassScreen extends StatefulWidget {
  const NewClassScreen({super.key});

  @override
  State<NewClassScreen> createState() => _NewClassScreenState();
}

class _NewClassScreenState extends State<NewClassScreen> {
  final TextEditingController _classNameController = TextEditingController();
  final TextEditingController _sectionController = TextEditingController();
  final TextEditingController _subjectController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    var provider = Provider.of<ClassesProvider>(context, listen: true);

    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(20),
        width: Get.width,
        height: Get.height,
        child: SafeArea(
          child: Column(
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
                    "New Class",
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
                          'Class Name',
                          style: const TextStyle(
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _classNameController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Class Name',
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
                          'Section',
                          style: const TextStyle(
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _sectionController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Section',
                        filled: true,
                      ),
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Icon(FeatherIcons.book),
                        const SizedBox(width: 10),
                        Text(
                          'Subject',
                          style: const TextStyle(
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _subjectController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Subject',
                        filled: true,
                      ),
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () async {
                        if (provider.creatingClass) {
                          return;
                        }

                        if (_classNameController.text.isEmpty ||
                            _sectionController.text.isEmpty ||
                            _subjectController.text.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                            content: Text("Please fill all the fields"),
                            backgroundColor: Colors.red,
                          ));
                          return;
                        }

                        provider.createClass(_classNameController.text,
                            _sectionController.text, _subjectController.text);
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.all(15),
                        backgroundColor: primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: provider.creatingClass
                          ? SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                valueColor:
                                    AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : Text(
                              'Create Class',
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
}
