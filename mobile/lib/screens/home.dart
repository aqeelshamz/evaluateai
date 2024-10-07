// home.dart

import 'package:evaluateai/screens/auth/login.dart';
import 'package:evaluateai/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // Bottom Navigation Index
  int _currentIndex = 0;

  // Dummy Data
  int selectedEvaluator = -1;
  int selectedClass = -1;

  List<String> evaluators = [
    'Math Evaluator',
    'Science Evaluator',
    'History Evaluator',
  ];

  List<Map<String, String>> classes = [
    {'subject': 'Mathematics', 'name': 'Class A', 'section': '1'},
    {'subject': 'Science', 'name': 'Class B', 'section': '2'},
    {'subject': 'History', 'name': 'Class C', 'section': '3'},
  ];

  // User Information (Dummy)
  String userName = 'John Doe';
  int evaluatorLimit = 3;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(appName),
        actions: [
          // User Menu
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'shop') {
                // Navigate to Shop
              } else if (value == 'purchases') {
                // Navigate to Purchases
              } else if (value == 'logout') {
                // Handle Logout
                SharedPreferences.getInstance().then((prefs) {
                  prefs.clear();
                  Get.offAll(const LoginScreen());
                });
              }
            },
            icon: const Icon(Icons.account_circle),
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'shop',
                child: ListTile(
                  leading: Icon(Icons.shopping_cart),
                  title: Text('Shop'),
                ),
              ),
              const PopupMenuItem<String>(
                value: 'purchases',
                child: ListTile(
                  leading: Icon(Icons.shopping_bag),
                  title: Text('My Purchases'),
                ),
              ),
              const PopupMenuDivider(),
              const PopupMenuItem<String>(
                value: 'logout',
                child: ListTile(
                  leading: Icon(Icons.logout, color: Colors.red),
                  title: Text('Logout'),
                ),
              ),
            ],
          ),
        ],
      ),
      body: _currentIndex == 0 ? _buildEvaluators() : _buildClasses(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        selectedItemColor: Colors.indigo,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
            // Reset selections when switching tabs
            selectedEvaluator = -1;
            selectedClass = -1;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(FeatherIcons.fileText),
            label: 'Evaluators',
          ),
          BottomNavigationBarItem(
            icon: Icon(FeatherIcons.users),
            label: 'Classes',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          if (_currentIndex == 0) {
            showDialog(
              context: context,
              builder: (context) => const NewEvaluatorModal(),
            );
          } else {
            showDialog(
              context: context,
              builder: (context) => const NewClassModal(),
            );
          }
        },
        backgroundColor: Colors.indigo,
        child: const Icon(FeatherIcons.plus),
      ),
    );
  }

  // Evaluators Tab Content
  Widget _buildEvaluators() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: evaluators.isEmpty
          ? const Center(
              child: Text(
                'No Evaluators Available',
                style: TextStyle(fontSize: 18, color: Colors.grey),
              ),
            )
          : ListView.builder(
              itemCount: evaluators.length,
              itemBuilder: (context, index) {
                return EvaluatorItem(
                  title: evaluators[index],
                  isSelected: selectedEvaluator == index,
                  onTap: () {
                    setState(() {
                      selectedEvaluator = index;
                    });
                  },
                );
              },
            ),
    );
  }

  // Classes Tab Content
  Widget _buildClasses() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: classes.isEmpty
          ? const Center(
              child: Text(
                'No Classes Available',
                style: TextStyle(fontSize: 18, color: Colors.grey),
              ),
            )
          : ListView.builder(
              itemCount: classes.length,
              itemBuilder: (context, index) {
                return ClassItem(
                  subject: classes[index]['subject']!,
                  name: classes[index]['name']!,
                  section: classes[index]['section']!,
                  isSelected: selectedClass == index,
                  onTap: () {
                    setState(() {
                      selectedClass = index;
                    });
                  },
                );
              },
            ),
    );
  }
}

// Evaluator Item Widget
class EvaluatorItem extends StatelessWidget {
  final String title;
  final bool isSelected;
  final VoidCallback onTap;

  const EvaluatorItem({
    Key? key,
    required this.title,
    required this.isSelected,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      color: isSelected ? Colors.indigo[50] : Colors.white,
      elevation: isSelected ? 4 : 1,
      child: ListTile(
        leading: const Icon(FeatherIcons.fileText, color: Colors.indigo),
        title: Text(title),
        trailing: isSelected
            ? Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextButton.icon(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => const EditEvaluatorModal(),
                      );
                    },
                    icon: const Icon(FeatherIcons.edit,
                        color: Colors.indigo, size: 16),
                    label: const Text(
                      'Edit',
                      style: TextStyle(color: Colors.indigo, fontSize: 12),
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => const DeleteEvaluatorModal(),
                      );
                    },
                    icon: const Icon(FeatherIcons.trash,
                        color: Colors.red, size: 16),
                    label: const Text(
                      'Delete',
                      style: TextStyle(color: Colors.red, fontSize: 12),
                    ),
                  ),
                ],
              )
            : null,
        onTap: onTap,
      ),
    );
  }
}

// Class Item Widget
class ClassItem extends StatelessWidget {
  final String subject;
  final String name;
  final String section;
  final bool isSelected;
  final VoidCallback onTap;

  const ClassItem({
    Key? key,
    required this.subject,
    required this.name,
    required this.section,
    required this.isSelected,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      color: isSelected ? Colors.indigo[50] : Colors.white,
      elevation: isSelected ? 4 : 1,
      child: ListTile(
        leading: const Icon(FeatherIcons.users, color: Colors.indigo),
        title: Text(subject),
        subtitle: Text('$name $section'),
        trailing: isSelected
            ? Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextButton.icon(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => const EditClassModal(),
                      );
                    },
                    icon: const Icon(FeatherIcons.edit,
                        color: Colors.indigo, size: 16),
                    label: const Text(
                      'Edit',
                      style: TextStyle(color: Colors.indigo, fontSize: 12),
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => const DeleteClassModal(),
                      );
                    },
                    icon: const Icon(FeatherIcons.trash,
                        color: Colors.red, size: 16),
                    label: const Text(
                      'Delete',
                      style: TextStyle(color: Colors.red, fontSize: 12),
                    ),
                  ),
                ],
              )
            : null,
        onTap: onTap,
      ),
    );
  }
}

// New Evaluator Modal
class NewEvaluatorModal extends StatefulWidget {
  const NewEvaluatorModal({Key? key}) : super(key: key);

  @override
  _NewEvaluatorModalState createState() => _NewEvaluatorModalState();
}

class _NewEvaluatorModalState extends State<NewEvaluatorModal> {
  final TextEditingController _titleController = TextEditingController();
  String? _selectedClass;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        children: const [
          Icon(FeatherIcons.plusCircle, color: Colors.indigo),
          SizedBox(width: 10),
          Text('New Evaluator'),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          children: [
            // Title Input
            Row(
              children: const [
                Icon(FeatherIcons.type, color: Colors.grey),
                SizedBox(width: 10),
                Text('Title'),
              ],
            ),
            const SizedBox(height: 5),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: "What's the name of the exam / evaluator?",
              ),
            ),
            const SizedBox(height: 20),
            // Class Selection
            Row(
              children: const [
                Icon(FeatherIcons.users, color: Colors.grey),
                SizedBox(width: 10),
                Text('Class'),
              ],
            ),
            const SizedBox(height: 5),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Select class',
              ),
              value: _selectedClass,
              items: [
                const DropdownMenuItem(
                  value: 'class1',
                  child: Text('Mathematics | Class A 1'),
                ),
                const DropdownMenuItem(
                  value: 'class2',
                  child: Text('Science | Class B 2'),
                ),
                const DropdownMenuItem(
                  value: 'class3',
                  child: Text('History | Class C 3'),
                ),
              ],
              onChanged: (value) {
                setState(() {
                  _selectedClass = value;
                });
              },
            ),
            const SizedBox(height: 20),
            // Upload Question Papers
            Row(
              children: const [
                Icon(FeatherIcons.fileText, color: Colors.grey),
                SizedBox(width: 10),
                Text('Upload question paper(s)'),
              ],
            ),
            const SizedBox(height: 5),
            TextButton.icon(
              onPressed: () {
                // Implement upload functionality
              },
              icon: const Icon(FeatherIcons.upload,
                  color: Colors.indigo, size: 16),
              label: const Text(
                'Upload',
                style: TextStyle(color: Colors.indigo),
              ),
            ),
            const SizedBox(height: 20),
            // Upload Answer Key / Criteria
            Row(
              children: const [
                Icon(FeatherIcons.key, color: Colors.grey),
                SizedBox(width: 10),
                Text('Upload answer key / criteria'),
              ],
            ),
            const SizedBox(height: 5),
            TextButton.icon(
              onPressed: () {
                // Implement upload functionality
              },
              icon: const Icon(FeatherIcons.upload,
                  color: Colors.indigo, size: 16),
              label: const Text(
                'Upload',
                style: TextStyle(color: Colors.indigo),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            // Handle Create Evaluator
            Navigator.pop(context);
          },
          style: TextButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: Colors.indigo,
          ),
          child: const Text('Create Evaluator'),
        ),
      ],
    );
  }
}

// Edit Evaluator Modal
class EditEvaluatorModal extends StatefulWidget {
  const EditEvaluatorModal({Key? key}) : super(key: key);

  @override
  _EditEvaluatorModalState createState() => _EditEvaluatorModalState();
}

class _EditEvaluatorModalState extends State<EditEvaluatorModal> {
  final TextEditingController _titleController = TextEditingController();
  String? _selectedClass;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        children: const [
          Icon(FeatherIcons.edit, color: Colors.indigo),
          SizedBox(width: 10),
          Text('Edit Evaluator'),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          children: [
            // Title Input
            Row(
              children: const [
                Icon(FeatherIcons.type, color: Colors.grey),
                SizedBox(width: 10),
                Text('Title'),
              ],
            ),
            const SizedBox(height: 5),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: "Evaluator Title",
              ),
            ),
            const SizedBox(height: 20),
            // Class Selection
            Row(
              children: const [
                Icon(FeatherIcons.users, color: Colors.grey),
                SizedBox(width: 10),
                Text('Class'),
              ],
            ),
            const SizedBox(height: 5),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Select class',
              ),
              value: _selectedClass,
              items: [
                const DropdownMenuItem(
                  value: 'class1',
                  child: Text('Mathematics | Class A 1'),
                ),
                const DropdownMenuItem(
                  value: 'class2',
                  child: Text('Science | Class B 2'),
                ),
                const DropdownMenuItem(
                  value: 'class3',
                  child: Text('History | Class C 3'),
                ),
              ],
              onChanged: (value) {
                setState(() {
                  _selectedClass = value;
                });
              },
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            // Handle Save Changes
            Navigator.pop(context);
          },
          style: TextButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: Colors.indigo,
          ),
          child: const Text('Save'),
        ),
      ],
    );
  }
}

// Delete Evaluator Modal
class DeleteEvaluatorModal extends StatelessWidget {
  const DeleteEvaluatorModal({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        children: const [
          Icon(FeatherIcons.trash, color: Colors.red),
          SizedBox(width: 10),
          Text('Delete Evaluator'),
        ],
      ),
      content: const Text('Are you sure you want to delete this evaluator?'),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            // Handle Delete Evaluator
            Navigator.pop(context);
          },
          style: TextButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: Colors.red,
          ),
          child: const Text('Delete'),
        ),
      ],
    );
  }
}

// New Class Modal
class NewClassModal extends StatefulWidget {
  const NewClassModal({Key? key}) : super(key: key);

  @override
  _NewClassModalState createState() => _NewClassModalState();
}

class _NewClassModalState extends State<NewClassModal> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _sectionController = TextEditingController();
  final TextEditingController _subjectController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        children: const [
          Icon(FeatherIcons.plusCircle, color: Colors.indigo),
          SizedBox(width: 10),
          Text('New Class'),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          children: [
            // Class Name Input
            Row(
              children: const [
                Icon(FeatherIcons.type, color: Colors.grey),
                SizedBox(width: 10),
                Text('Class Name'),
              ],
            ),
            const SizedBox(height: 5),
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Class Name',
              ),
            ),
            const SizedBox(height: 20),
            // Section Input
            Row(
              children: const [
                Icon(FeatherIcons.users, color: Colors.grey),
                SizedBox(width: 10),
                Text('Section'),
              ],
            ),
            const SizedBox(height: 5),
            TextField(
              controller: _sectionController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Section',
              ),
            ),
            const SizedBox(height: 20),
            // Subject Input
            Row(
              children: const [
                Icon(FeatherIcons.book, color: Colors.grey),
                SizedBox(width: 10),
                Text('Subject'),
              ],
            ),
            const SizedBox(height: 5),
            TextField(
              controller: _subjectController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Subject',
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            // Handle Create Class
            Navigator.pop(context);
          },
          style: TextButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: Colors.indigo,
          ),
          child: const Text('Create Class'),
        ),
      ],
    );
  }
}

// Edit Class Modal
class EditClassModal extends StatefulWidget {
  const EditClassModal({Key? key}) : super(key: key);

  @override
  _EditClassModalState createState() => _EditClassModalState();
}

class _EditClassModalState extends State<EditClassModal> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _sectionController = TextEditingController();
  final TextEditingController _subjectController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        children: const [
          Icon(FeatherIcons.edit, color: Colors.indigo),
          SizedBox(width: 10),
          Text('Edit Class'),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          children: [
            // Class Name Input
            Row(
              children: const [
                Icon(FeatherIcons.type, color: Colors.grey),
                SizedBox(width: 10),
                Text('Class Name'),
              ],
            ),
            const SizedBox(height: 5),
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Class Name',
              ),
            ),
            const SizedBox(height: 20),
            // Section Input
            Row(
              children: const [
                Icon(FeatherIcons.users, color: Colors.grey),
                SizedBox(width: 10),
                Text('Section'),
              ],
            ),
            const SizedBox(height: 5),
            TextField(
              controller: _sectionController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Section',
              ),
            ),
            const SizedBox(height: 20),
            // Subject Input
            Row(
              children: const [
                Icon(FeatherIcons.book, color: Colors.grey),
                SizedBox(width: 10),
                Text('Subject'),
              ],
            ),
            const SizedBox(height: 5),
            TextField(
              controller: _subjectController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Subject',
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            // Handle Save Changes
            Navigator.pop(context);
          },
          style: TextButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: Colors.indigo,
          ),
          child: const Text('Save'),
        ),
      ],
    );
  }
}

// Delete Class Modal
class DeleteClassModal extends StatelessWidget {
  const DeleteClassModal({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        children: const [
          Icon(FeatherIcons.trash, color: Colors.red),
          SizedBox(width: 10),
          Text('Delete Class'),
        ],
      ),
      content: const Text('Are you sure you want to delete this class?'),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            // Handle Delete Class
            Navigator.pop(context);
          },
          style: TextButton.styleFrom(
            backgroundColor: Colors.red,
          ),
          child: const Text('Delete'),
        ),
      ],
    );
  }
}
