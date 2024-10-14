import 'package:evaluateai/screens/pages/classes.dart';
import 'package:evaluateai/screens/pages/evaluators.dart';
import 'package:evaluateai/screens/pages/user.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  PageController _pageController = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: PageView(
          controller: _pageController,
          children: const [EvaluatorsPage(), ClassesPage(), UserPage()],
          onPageChanged: (value) => setState(() {
            _currentIndex = value;
          }),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        destinations: [
          NavigationDestination(
            icon: Icon(FeatherIcons.fileText),
            label: 'Evaluators',
          ),
          NavigationDestination(
            icon: Icon(FeatherIcons.users),
            label: 'Classes',
          ),
          NavigationDestination(
            icon: Icon(FeatherIcons.user),
            label: 'Profile',
          ),
        ],
        onDestinationSelected: (value) => setState(() {
          _currentIndex = value;
          _pageController
            ..animateToPage(
              value,
              duration: const Duration(milliseconds: 300),
              curve: Curves.ease,
            );
        }),
        selectedIndex: _currentIndex,
      ),
      floatingActionButton: _currentIndex == 2
          ? null
          : FloatingActionButton.extended(
              onPressed: () {},
              label: Text(["New Evaluator", "New Class"][_currentIndex]),
              icon: const Icon(FeatherIcons.plus),
            ),
    );
  }
}
