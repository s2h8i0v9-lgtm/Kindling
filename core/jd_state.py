# core/jd_state.py
# The notebook — saves everything the employer tells Spark Seed

class JDState:

    def __init__(self):
        # One empty list per section to store answers
        self.data = {
            "the_role":       [],
            "the_mission":    [],
            "must_haves":     [],
            "nice_to_haves":  [],
            "open_paths":     [],
            "the_reality":    [],
            "review_export":  []
        }

    def collect(self, section_id, message):
        """Save one employer message to the right section"""
        if section_id in self.data:
            self.data[section_id].append(message)

    def get_section(self, section_id):
        """Get everything collected for one section"""
        return self.data.get(section_id, [])

    def get_all(self):
        """Get everything collected across all sections"""
        return self.data

    def is_empty(self):
        """Check if nothing has been collected yet"""
        return all(len(v) == 0 for v in self.data.values())

    def summary(self):
        """Show how many answers have been collected per section"""
        return {
            section: len(answers)
            for section, answers in self.data.items()
        }